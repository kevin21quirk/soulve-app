import { Hono } from 'hono';
import { put } from '@vercel/blob';
import { requireAuth } from '../middleware/clerk';

const upload = new Hono();

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
  'video/mp4', 'video/webm',
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

// POST /api/upload  — secure server-side upload to Vercel Blob
// Expects multipart/form-data with a 'file' field and optional 'folder' field
upload.post('/', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const formData = await c.req.formData();
  const file = formData.get('file');
  const folder = (formData.get('folder') as string | null) ?? 'uploads';

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided' }, 400);
  }

  const blob = file as File;

  // Server-side validation
  if (!ALLOWED_TYPES.includes(blob.type)) {
    return c.json({ error: `File type ${blob.type} is not allowed` }, 422);
  }
  if (blob.size > MAX_SIZE) {
    return c.json({ error: 'File exceeds 20 MB limit' }, 413);
  }

  const filename = `${folder}/${clerkUserId}/${Date.now()}-${blob.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const result = await put(filename, blob, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return c.json({ url: result.url, pathname: result.pathname }, 201);
});

export default upload;
