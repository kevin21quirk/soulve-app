import { optimizeImage } from './imageOptimization';

/**
 * Blog image upload — proxies through the /api/upload Vercel Blob endpoint.
 * Pass the Clerk session token from useAuth().session.access_token.
 */

async function uploadViaApi(file: File, folder: string, token: string): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Failed to upload image: ${(err as { error?: string }).error ?? res.statusText}`);
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}

/**
 * Uploads a blog image via Vercel Blob after optimisation.
 * @param file   - The image file to upload
 * @param _userId - Kept for API compatibility; identity comes from the token
 * @param token  - Clerk session access token
 */
export const uploadBlogImage = async (file: File, _userId: string, token: string): Promise<string> => {
  const optimizedBlob = await optimizeImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'jpeg',
  });
  const optimizedFile = new File(
    [optimizedBlob],
    file.name.replace(/\.[^.]+$/, '.jpg'),
    { type: 'image/jpeg' },
  );
  return uploadViaApi(optimizedFile, 'blog-images', token);
};

/** Uploads multiple blog images. */
export const uploadBlogImages = async (files: File[], userId: string, token: string): Promise<string[]> =>
  Promise.all(files.map(f => uploadBlogImage(f, userId, token)));

/**
 * Deletes a blog image via the server-side DELETE /api/upload endpoint.
 * The server enforces ownership — the blob URL must belong to the authenticated user.
 */
export const deleteBlogImage = async (imageUrl: string, token: string): Promise<void> => {
  if (!token) throw new Error('User must be authenticated to delete files');

  const res = await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Failed to delete image: ${(err as { error?: string }).error ?? res.statusText}`);
  }
};
