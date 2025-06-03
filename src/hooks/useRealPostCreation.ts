
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PostCreationData {
  title: string;
  content: string;
  category: string;
  urgency: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const useRealPostCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createPost = async (postData: PostCreationData) => {
    if (!user) {
      throw new Error('User must be authenticated to create posts');
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          content: postData.content,
          category: postData.category,
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
      setIsCreating(false);
    }
  };

  return {
    createPost,
    isCreating
  };
};
