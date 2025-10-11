
import { useState, useEffect, useCallback } from 'react';
import { useRealSocialFeed } from './useRealSocialFeed';
import { usePostInteractions } from './usePostInteractions';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedSocialFeed = () => {
  const { toast } = useToast();
  const {
    posts,
    loading,
    refreshing,
    refreshFeed,
    handleLike: originalHandleLike,
    handleBookmark: originalHandleBookmark,
    handleShare: originalHandleShare,
    handleAddComment: originalHandleAddComment
  } = useRealSocialFeed();

  const {
    handleLike: interactionHandleLike,
    handleBookmark: interactionHandleBookmark,
    handleAddComment: interactionHandleAddComment,
    handleShare: interactionHandleShare,
    isLoading
  } = usePostInteractions();

  // Enhanced handlers that update both local state and database
  const handleLike = useCallback(async (postId: string) => {
    try {
      const success = await interactionHandleLike(postId);
      // Real-time subscriptions will handle the refresh automatically
      return success;
    } catch (error) {
      console.error('Enhanced like handler error:', error);
      return false;
    }
  }, [interactionHandleLike]);

  const handleBookmark = useCallback(async (postId: string) => {
    try {
      const success = await interactionHandleBookmark(postId);
      // Real-time subscriptions will handle the refresh automatically
      return success;
    } catch (error) {
      console.error('Enhanced bookmark handler error:', error);
      return false;
    }
  }, [interactionHandleBookmark]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    try {
      const success = await interactionHandleAddComment(postId, content);
      if (success) {
        // Real-time subscriptions will handle the refresh automatically
        toast({
          title: "Comment posted!",
          description: "Your comment has been added to the conversation."
        });
      }
      return success;
    } catch (error) {
      console.error('Enhanced comment handler error:', error);
      return false;
    }
  }, [interactionHandleAddComment, toast]);

  const handleShare = useCallback(async (postId: string) => {
    try {
      const success = await interactionHandleShare(postId);
      // Real-time subscriptions will handle the refresh automatically
      return success;
    } catch (error) {
      console.error('Enhanced share handler error:', error);
      return false;
    }
  }, [interactionHandleShare]);

  return {
    posts,
    loading,
    refreshing,
    refreshFeed,
    handleLike,
    handleBookmark,
    handleAddComment,
    handleShare,
    isLoading
  };
};
