
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
      if (success !== undefined) {
        // Refresh feed to get updated counts
        setTimeout(() => refreshFeed(), 500);
      }
      return success;
    } catch (error) {
      console.error('Enhanced like handler error:', error);
      return false;
    }
  }, [interactionHandleLike, refreshFeed]);

  const handleBookmark = useCallback(async (postId: string) => {
    try {
      const success = await interactionHandleBookmark(postId);
      if (success !== undefined) {
        // Refresh feed to get updated bookmark status
        setTimeout(() => refreshFeed(), 500);
      }
      return success;
    } catch (error) {
      console.error('Enhanced bookmark handler error:', error);
      return false;
    }
  }, [interactionHandleBookmark, refreshFeed]);

  const handleAddComment = useCallback(async (postId: string, content: string) => {
    try {
      const success = await interactionHandleAddComment(postId, content);
      if (success) {
        // Refresh feed to get updated comment counts
        setTimeout(() => refreshFeed(), 500);
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
  }, [interactionHandleAddComment, refreshFeed, toast]);

  const handleShare = useCallback(async (postId: string) => {
    try {
      const success = await interactionHandleShare(postId);
      if (success) {
        // Refresh feed to get updated share counts
        setTimeout(() => refreshFeed(), 500);
      }
      return success;
    } catch (error) {
      console.error('Enhanced share handler error:', error);
      return false;
    }
  }, [interactionHandleShare, refreshFeed]);

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
