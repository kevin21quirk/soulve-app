import { Hono } from 'hono';
import { put, del } from '@vercel/blob';
import { requireAuth } from '../middleware/clerk';
import { BLOB_HOSTNAME_RE } from '../lib/blobUrl';
import { resolveCaller } from '../lib/authz';
import {
  authorizePrivateUpload,
  commitPrivateUpload,
  PrivateUploadError,
} from '../lib/privateUpload';

const upload = new Hono();

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
  'video/mp4', 'video/webm',
  'application/pdf',
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

// Allowed upload folder names (single-segment, no path separators).
// The DELETE ownership check relies on segments[1] === clerkUserId, which is
// only safe when the folder is a single path segment (no '/').
const PUBLIC_FOLDERS = new Set([
  // Public — displayed directly in the browser
  'post-media',
  'campaign-images',
  'blog-images',
  'avatars',
  'banners',
  'org-avatars',
  'org-banners',
]);

// Private — access-controlled content. The server decides access level from
// the folder name; clients never pass an access flag. Every private upload
// requires recordId (a real parent record UUID) and folder-specific docType.
const PRIVATE_FOLDERS = new Set([
  'feedback-screenshots',
  'esg-documents',
  'esg-supporting-documents',
  'esg-reports',
  'helper-verification-docs',
  'id-verifications',
]);

// ── POST /api/upload ──────────────────────────────────────────────────────
// Accepts multipart/form-data with 'file', 'folder', and for private folders
// 'recordId' + 'docType' fields.
// Auth: Vercel OIDC in production/preview (auto); BLOB_READ_WRITE_TOKEN in
// local dev (auto). The library resolves auth automatically:
//   1. VERCEL_OIDC_TOKEN + BLOB_STORE_ID  → OIDC  (Vercel prod/preview)
//   2. process.env.BLOB_READ_WRITE_TOKEN  → token  (local dev fallback)
upload.post('/', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const formData = await c.req.formData();
  const file = formData.get('file');
  const folder = (formData.get('folder') as string | null)?.trim();

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided' }, 400);
  }
  if (!folder || folder.includes('/') || folder.includes('\\')) {
    return c.json({ error: 'A valid "folder" field is required' }, 400);
  }

  const isPrivate = PRIVATE_FOLDERS.has(folder);
  if (!isPrivate && !PUBLIC_FOLDERS.has(folder)) {
    return c.json({ error: `Unknown upload folder "${folder}"` }, 400);
  }

  const blob = file as File;

  if (!ALLOWED_TYPES.includes(blob.type)) {
    return c.json({ error: `File type ${blob.type} is not allowed` }, 422);
  }
  if (blob.size > MAX_SIZE) {
    return c.json({ error: 'File exceeds 20 MB limit' }, 413);
  }

  const safeName = blob.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (!isPrivate) {
    // Public path — unchanged behaviour.
    // Pathname: folder/clerkUserId/timestamp-sanitisedName
    const pathname = `${folder}/${clerkUserId}/${Date.now()}-${safeName}`;
    const result = await put(pathname, blob, { access: 'public' });
    return c.json({ url: result.url, pathname: result.pathname }, 201);
  }

  // ── Private path ──────────────────────────────────────────────────────
  // 1. Resolve caller + authorise against the parent record BEFORE upload.
  const caller = await resolveCaller(clerkUserId);
  if (!caller) return c.json({ error: 'Profile not found' }, 401);

  const recordId = formData.get('recordId') as string | null;
  const docType = formData.get('docType') as string | null;

  let parent;
  try {
    parent = await authorizePrivateUpload(folder, caller, recordId ?? undefined, docType ?? undefined);
  } catch (err) {
    if (err instanceof PrivateUploadError) {
      return c.json({ error: err.message }, err.status);
    }
    throw err;
  }

  // 2. Upload the blob (random UUID component — defence-in-depth only;
  //    authorization above is the security boundary).
  const pathname = `${folder}/${clerkUserId}/${crypto.randomUUID()}-${safeName}`;
  const result = await put(pathname, blob, { access: 'private' });

  // 3. Write Neon metadata. On failure, delete the orphan blob; if deletion
  //    also fails, emit a structured orphan log for manual cleanup.
  try {
    // Optional extras — currently only used by id-verifications.
    const faceDetected = formData.get('faceDetected') === 'true';
    const faceQualityRaw = formData.get('faceQualityScore') as string | null;
    const faceQualityScore =
      faceQualityRaw !== null && !Number.isNaN(Number(faceQualityRaw))
        ? Number(faceQualityRaw)
        : null;

    const documentId = await commitPrivateUpload(
      folder, caller, parent, result.url, result.pathname, blob, docType ?? undefined,
      { faceDetected, faceQualityScore },
    );
    return c.json({ documentId }, 201);
  } catch (err) {
    try {
      await del(result.url);
    } catch {
      console.error('[ORPHANED_BLOB]', {
        url: result.url,
        pathname: result.pathname,
        folder,
        clerkUserId,
        recordId: parent.id,
        ts: new Date().toISOString(),
      });
    }
    console.error('Private upload metadata write failed:', err);
    return c.json({ error: 'Failed to register document' }, 500);
  }
});

// ── DELETE /api/upload ────────────────────────────────────────────────────
// Body: { url: string }  — the full Vercel Blob URL to delete.
// Public blobs only — private documents are deleted via
// DELETE /api/documents/:type/:id which applies resource-level authorization.
// Security:
//   1. Requires Clerk authentication.
//   2. Validates URL is from the Vercel Blob domain (prevents SSRF / external deletions).
//   3. Ownership check: segments[1] of the pathname must equal the requesting clerkUserId.
upload.delete('/', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');

  let url: string;
  try {
    const body = await c.req.json<{ url: string }>();
    url = body.url;
  } catch {
    return c.json({ error: 'Request body must be JSON with a "url" field' }, 400);
  }

  if (!url || typeof url !== 'string') {
    return c.json({ error: '"url" is required' }, 400);
  }

  // Parse the URL safely — rejects anything that isn't a valid URL.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return c.json({ error: 'Invalid URL' }, 400);
  }

  // Guard: only accept Vercel Blob hostnames.
  // Prevents del() being invoked on arbitrary external URLs.
  if (!BLOB_HOSTNAME_RE.test(parsed.hostname)) {
    return c.json({ error: 'URL is not a Vercel Blob URL' }, 400);
  }

  // Ownership check.
  // pathname e.g. /post-media/user_abc123/1234567890-photo.jpg
  // segments  →  ['post-media', 'user_abc123', '1234567890-photo.jpg']
  // Because the POST endpoint validates that folder has no '/', segments[1]
  // is always the clerkUserId of the original uploader.
  const segments = parsed.pathname.replace(/^\//, '').split('/');
  if (segments.length < 3 || segments[1] !== clerkUserId) {
    return c.json({ error: 'Forbidden: you do not own this file' }, 403);
  }

  // Refuse to delete private blobs through this public route — they must go
  // through /api/documents so Neon metadata stays consistent.
  if (PRIVATE_FOLDERS.has(segments[0])) {
    return c.json({ error: 'Private documents must be deleted via /api/documents' }, 400);
  }

  await del(url);
  // No token option — library auto-detects OIDC or BLOB_READ_WRITE_TOKEN

  return c.json({ deleted: true });
});

export default upload;
