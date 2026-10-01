/**
 * Campaign image upload — routes through the /api/upload Vercel Blob endpoint.
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
 * Uploads a campaign image file via Vercel Blob.
 * @param file - The image file to upload
 * @param _userId - Kept for API compatibility; user identity comes from the token
 * @param token - Clerk session access token
 */
export const uploadCampaignImage = async (file: File, _userId: string, token: string): Promise<string> =>
  uploadViaApi(file, 'campaign-images', token);

/**
 * Uploads multiple campaign image files.
 */
export const uploadCampaignImages = async (files: File[], userId: string, token: string): Promise<string[]> =>
  Promise.all(files.map(f => uploadCampaignImage(f, userId, token)));

/**
 * Converts a blob URL to a File object for upload.
 */
export const blobUrlToFile = async (blobUrl: string, fileName = 'image.jpg'): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
