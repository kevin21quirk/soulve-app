
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mapCategoryToDb } from '@/utils/categoryMapping';

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  urgency: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const useCreatePost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = async (postData: CreatePostData) => {
    if (!user) {
      throw new Error('User must be authenticated to create posts');
    }

    setIsSubmitting(true);

    try {
      // Map the display category to database category
      const dbCategory = mapCategoryToDb(postData.category);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          content: postData.content,
          category: dbCategory, // Use mapped category
          urgency: postData.urgency,
          location: postData.location || null,
          tags: postData.tags || [],
          visibility: postData.visibility || 'public',
          media_urls: postData.media_urls || [],
          author_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting
  };
};
