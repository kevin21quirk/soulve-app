/**
 * Media upload service — uploads files via the Vercel Blob API endpoint.
 * Requires a valid Clerk session token (obtained via useAuth().session.access_token).
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
 * Delete a Vercel Blob asset via the API.
 * Note: Vercel Blob deletion requires a server-side call — this sends
 * the URL to a delete endpoint when one is implemented.
 */
export const deleteMediaFile = async (fileUrl: string, token: string): Promise<void> => {
  if (!token) throw new Error('User must be authenticated to delete files');

  // Placeholder: the delete endpoint is not yet implemented.
  // In the meantime, log the URL so it can be cleaned up manually.
  console.warn('[mediaUploadService] deleteMediaFile not yet implemented for Vercel Blob:', fileUrl);
};
