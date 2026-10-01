import { Hono } from 'hono';
import { put, del } from '@vercel/blob';
import { requireAuth } from '../middleware/clerk';

const upload = new Hono();

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
  'video/mp4', 'video/webm',
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

// Allowed upload folder names (single-segment, no path separators).
// The DELETE ownership check relies on segments[1] === clerkUserId, which is
// only safe when the folder is a single path segment (no '/').
const ALLOWED_FOLDERS = new Set([
  // Public — displayed directly in the browser
  'post-media',
  'campaign-images',
  'blog-images',
  'avatars',
  'banners',
  'org-avatars',
  'org-banners',
  'uploads',
]);

// Vercel Blob URL hostname pattern — used to prevent del() being called on
// arbitrary external URLs.
const BLOB_HOSTNAME_RE = /^[a-z0-9]+\.(?:public|private)\.blob\.vercel-storage\.com$/;

// ── POST /api/upload ──────────────────────────────────────────────────────
// Accepts multipart/form-data with a 'file' field and optional 'folder' field.
// Auth: Vercel OIDC in production/preview (auto); BLOB_READ_WRITE_TOKEN in local dev (auto).
// No explicit token option — the @vercel/blob library resolves auth automatically:
//   1. VERCEL_OIDC_TOKEN + BLOB_STORE_ID  → OIDC  (Vercel prod/preview, injected by runtime)
//   2. process.env.BLOB_READ_WRITE_TOKEN  → token  (local dev fallback)
upload.post('/', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const formData = await c.req.formData();
  const file = formData.get('file');
  const folderRaw = (formData.get('folder') as string | null) ?? 'uploads';

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided' }, 400);
  }

  // Validate folder: must be a known single-segment name, no path separators.
  const folder = folderRaw.trim();
  if (!ALLOWED_FOLDERS.has(folder) || folder.includes('/') || folder.includes('\\')) {
    return c.json({ error: `Unknown upload folder "${folder}"` }, 400);
  }

  const blob = file as File;

  if (!ALLOWED_TYPES.includes(blob.type)) {
    return c.json({ error: `File type ${blob.type} is not allowed` }, 422);
  }
  if (blob.size > MAX_SIZE) {
    return c.json({ error: 'File exceeds 20 MB limit' }, 413);
  }

  // Pathname: folder/clerkUserId/timestamp-sanitisedName
  // The clerkUserId segment is used for ownership verification on delete.
  const safeName = blob.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `${folder}/${clerkUserId}/${Date.now()}-${safeName}`;

  const result = await put(pathname, blob, {
    access: 'public',
    // No token option — library auto-detects OIDC or BLOB_READ_WRITE_TOKEN
  });

  return c.json({ url: result.url, pathname: result.pathname }, 201);
});

// ── DELETE /api/upload ────────────────────────────────────────────────────
// Body: { url: string }  — the full Vercel Blob URL to delete.
// Security:
//   1. Requires Clerk authentication.
//   2. Validates URL is from the Vercel Blob domain (prevents SSRF / external deletions).
//   3. Ownership check: segments[1] of the pathname must equal the requesting clerkUserId.
//      This is always correct because POST produces: folder/clerkUserId/timestamp-name,
//      and folder is validated to be a single-segment name (no embedded slashes).
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

  await del(url);
  // No token option — library auto-detects OIDC or BLOB_READ_WRITE_TOKEN

  return c.json({ deleted: true });
});

export default upload;
