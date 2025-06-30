
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MediaUploadResult {
  url: string;
  filename: string;
  type: 'image' | 'video';
}

export const uploadMediaFiles = async (files: File[]): Promise<MediaUploadResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to upload files');
  }

  console.log('Starting media upload for', files.length, 'files');

  const uploadPromises = files.map(async (file) => {
    try {
      // Validate file type and size
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        throw new Error(`File ${file.name} is not a supported media type`);
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB`);
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file:', fileName, 'to path:', filePath);

      const { data, error } = await supabase.storage
        .from('post-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      console.log('File uploaded successfully:', data.path);

      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      return {
        url: publicUrl,
        filename: file.name,
        type: isImage ? 'image' as const : 'video' as const
      };
    } catch (error) {
      console.error('Error uploading file:', file.name, error);
      throw error;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log('All media files uploaded successfully:', results);
    return results;
  } catch (error) {
    console.error('Error in media upload batch:', error);
    throw error;
  }
};

export const deleteMediaFile = async (fileUrl: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to delete files');
  }

  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('post-media')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    console.log('File deleted successfully:', filePath);
  } catch (error) {
    console.error('Error in deleteMediaFile:', error);
    throw error;
  }
};
