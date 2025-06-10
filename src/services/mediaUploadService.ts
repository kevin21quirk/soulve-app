
import { supabase } from "@/integrations/supabase/client";

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

  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('post-media')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-media')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      filename: file.name,
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const
    };
  });

  return Promise.all(uploadPromises);
};
