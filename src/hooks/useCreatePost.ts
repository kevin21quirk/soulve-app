
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createUnifiedPost } from '@/services/unifiedPostService';
import { useContentModeration } from './useContentModeration';
import { usePostCreationRateLimit } from './useRateLimit';
import { supabase } from '@/integrations/supabase/client';

export interface CreatePostData {
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

export const useCreatePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { moderateContent, isModeratingContent } = useContentModeration();
  const rateLimit = usePostCreationRateLimit();

  const createPost = async (postData: CreatePostData) => {
    // Check rate limit first
    if (rateLimit.isLimited) {
      const resetTime = rateLimit.resetTime?.toLocaleTimeString() || 'soon';
      toast({
        title: "Too many posts",
        description: `You've reached the posting limit. Try again after ${resetTime}.`,
        variant: "destructive"
      });
      throw new Error('Rate limit exceeded');
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!postData.content?.trim()) {
        throw new Error('Post content is required');
      }

      if (!postData.category?.trim()) {
        throw new Error('Please select a category');
      }

      // Record rate limit attempt
      if (!(rateLimit as any).recordAttempt()) {
        throw new Error('Rate limit exceeded');
      }

      // Content moderation check
      const moderationResult = await moderateContent(postData.content, postData.title);
      
      if (!moderationResult.allowed) {
        throw new Error(moderationResult.message);
      }

      // Show moderation feedback if content was flagged
      if (moderationResult.flagged) {
        toast({
          title: "Content flagged for review",
          description: "Your post has been published but flagged for review by moderators.",
          variant: "default"
        });
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
        queryClient.invalidateQueries({ 
          queryKey: ['user-profile', userId],
          refetchType: 'active'
        });
        queryClient.invalidateQueries({ 
          queryKey: ['user-posts', userId],
          refetchType: 'active'
        });
      }

      toast({
        title: "Post created successfully!",
        description: moderationResult.flagged 
          ? "Your post is published but under review."
          : "Your post has been shared with the community.",
      });

      return { id: postId, success: true };
    } catch (error: any) {
      console.error('useCreatePost - Error:', error);
      
      let errorMessage = 'Failed to create post';
      if (error.message.includes('category')) {
        errorMessage = 'Please select a valid category';
      } else if (error.message.includes('content')) {
        errorMessage = 'Please add content to your post';
      } else if (error.message.includes('Content blocked')) {
        errorMessage = error.message;
      } else if (error.message.includes('Rate limit')) {
        errorMessage = `Posting too frequently. ${rateLimit.remainingAttempts} posts remaining.`;
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
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting: isSubmitting || isModeratingContent,
    rateLimit
  };
};
