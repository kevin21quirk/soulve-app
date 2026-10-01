import { Hono } from 'hono';
import { put, del } from '@vercel/blob';
import { requireAuth } from '../middleware/clerk';

const upload = new Hono();

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
  'video/mp4', 'video/webm',
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

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
  const folder = (formData.get('folder') as string | null) ?? 'uploads';

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided' }, 400);
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
// Ownership check: the URL's pathname must contain the requesting user's clerkUserId.
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

  // Ownership: the pathname segment containing the user ID must match.
  // Blob pathnames are structured as:  folder/clerkUserId/timestamp-filename
  // The URL is:  https://<storeId>.public.blob.vercel-storage.com/<pathname>
  let parsedPathname: string;
  try {
    parsedPathname = new URL(url).pathname;
  } catch {
    return c.json({ error: 'Invalid URL' }, 400);
  }

  // e.g. /post-media/user_abc123/1234567890-photo.jpg
  const segments = parsedPathname.replace(/^\//, '').split('/');
  // segments[1] is the clerkUserId (folder / userId / filename)
  if (segments.length < 3 || segments[1] !== clerkUserId) {
    return c.json({ error: 'Forbidden: you do not own this file' }, 403);
  }

  await del(url);
  // No token option — library auto-detects auth (same as put)

  return c.json({ deleted: true });
});

export default upload;
