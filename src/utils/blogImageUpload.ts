import { supabase } from '@/integrations/supabase/client';
import { optimizeImage } from './imageOptimization';

/**
 * Uploads a blog image to Supabase Storage
 */
export const uploadBlogImage = async (file: File, userId: string): Promise<string> => {
  try {
    // Optimize image before upload
    const optimizedBlob = await optimizeImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'jpeg',
    });

    // Generate unique file name
    const fileExt = 'jpg'; // Always use jpg after optimization
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, optimizedBlob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Blog image upload failed:', error);
    throw error;
  }
};

/**
 * Uploads multiple blog images
 */
export const uploadBlogImages = async (files: File[], userId: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadBlogImage(file, userId));
  return Promise.all(uploadPromises);
};

/**
 * Deletes a blog image from storage
 */
export const deleteBlogImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/blog-images\/(.*)/);
    
    if (!pathMatch) {
      throw new Error('Invalid blog image URL');
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Blog image deletion failed:', error);
    throw error;
  }
};
