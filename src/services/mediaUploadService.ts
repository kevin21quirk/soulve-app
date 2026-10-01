/**
 * Media upload service — proxies through the /api/upload Vercel Blob endpoint.
 * Passes the Clerk session token so the API can authenticate the caller.
 */

export interface MediaUploadResult {
  url: string;
  filename: string;
  type: 'image' | 'video';
}

export const uploadMediaFiles = async (
  files: File[],
  token: string,
  folder = 'post-media',
): Promise<MediaUploadResult[]> => {
  if (!token) throw new Error('User must be authenticated to upload files');

  const uploadPromises = files.map(async (file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      throw new Error(`File ${file.name} is not a supported media type`);
    }
    if (file.size > 20 * 1024 * 1024) {
      throw new Error(`File ${file.name} exceeds the 20 MB limit`);
    }

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
      throw new Error(`Failed to upload ${file.name}: ${(err as { error?: string }).error ?? res.statusText}`);
    }

    const { url } = (await res.json()) as { url: string; pathname: string };
    return {
      url,
      filename: file.name,
      type: isImage ? ('image' as const) : ('video' as const),
    };
  });

  return Promise.all(uploadPromises);
};

/**
 * Deletes a Vercel Blob asset via the server-side DELETE /api/upload endpoint.
 * The server enforces ownership — the blob must belong to the authenticated user.
 */
export const deleteMediaFile = async (fileUrl: string, token: string): Promise<void> => {
  if (!token) throw new Error('User must be authenticated to delete files');

  const res = await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: fileUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Failed to delete file: ${(err as { error?: string }).error ?? res.statusText}`);
  }
};
