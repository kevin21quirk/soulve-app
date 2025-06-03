
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  urgency: string;
  location?: string;
  tags: string[];
  visibility: string;
  media_urls?: string[];
}

export const useRealPostCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createPost = async (postData: CreatePostData): Promise<string> => {
    if (!user) {
      throw new Error('User must be authenticated to create posts');
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          title: postData.title || postData.content.split('\n')[0].substring(0, 100),
          content: postData.content,
          category: postData.category,
          urgency: postData.urgency,
          location: postData.location,
          tags: postData.tags,
          visibility: postData.visibility,
          media_urls: postData.media_urls || [],
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
      }

      // Create notification for followers/connections (future feature)
      // await createPostNotification(data.id);

      toast({
        title: "Post created successfully! 🎉",
        description: "Your post is now live on the platform."
      });

      return data.id;

    } catch (error) {
      console.error('Error in createPost:', error);
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPost,
    isCreating
  };
};
