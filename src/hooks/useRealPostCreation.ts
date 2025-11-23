
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedPost } from '@/services/unifiedPostService';
import { supabase } from '@/integrations/supabase/client';

export interface PostCreationData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
  tagged_user_ids?: string[];
}

export const useRealPostCreation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const createPost = async (postData: PostCreationData) => {
    console.log('useRealPostCreation - Starting with data:', postData);
    
    setIsCreating(true);

    try {
      // Validate required fields
      if (!postData.content?.trim()) {
        throw new Error('Post content is required');
      }

      if (!postData.category?.trim()) {
        throw new Error('Please select a category');
      }

      const postId = await createUnifiedPost(postData);

      // Get user ID for invalidations
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const userId = currentUser?.id;

      // Invalidate feed queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
      queryClient.invalidateQueries({ queryKey: ['social-feed-infinite'] });

      // Invalidate user-specific queries with correct keys
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
        queryClient.invalidateQueries({ queryKey: ['user-posts', userId] });
      }

      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });

      return { id: postId, success: true };
    } catch (error: any) {
      console.error('useRealPostCreation - Error:', error);
      
      let errorMessage = 'Failed to create post';
      if (error.message.includes('category')) {
        errorMessage = 'Please select a valid category';
      } else if (error.message.includes('content')) {
        errorMessage = 'Please add content to your post';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to create post",
        description: errorMessage,
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
