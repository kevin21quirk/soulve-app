import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a campaign image file to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The ID of the user uploading the image
 * @returns The public URL of the uploaded image
 */
export const uploadCampaignImage = async (file: File, userId: string): Promise<string> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('campaign-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Campaign image upload failed:', error);
    throw error;
  }
};

/**
 * Uploads multiple campaign image files
 * @param files - Array of image files to upload
 * @param userId - The ID of the user uploading the images
 * @returns Array of public URLs for uploaded images
 */
export const uploadCampaignImages = async (files: File[], userId: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadCampaignImage(file, userId));
  return Promise.all(uploadPromises);
};

/**
 * Converts blob URLs to actual file objects for upload
 * @param blobUrl - The blob URL to convert
 * @returns File object
 */
export const blobUrlToFile = async (blobUrl: string, fileName: string = 'image.jpg'): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
