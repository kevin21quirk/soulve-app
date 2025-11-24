import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocialFeed, SocialPost } from '@/services/socialFeedService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createInteraction } from '@/services/interactionRoutingService';
import { devLogger as logger } from '@/utils/logger';

export type { SocialPost };

/**
 * Enhanced social feed hook using React Query for optimal caching
 * 
 * Key improvements:
 * - Uses React Query cache to prevent refetching on tab switches
 * - Data persists across component unmounts
 * - Automatic background refetching based on staleTime
 * - Optimistic updates for instant UI feedback
 * - Real-time updates handled by RealtimeManager
 */
export const useRealSocialFeed = (organizationId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use React Query hook for cached data
  const { 
    data: posts = [], 
    isLoading: loading, 
    refetch,
    isRefetching
  } = useSocialFeed(organizationId, user?.id);

  /**
   * Manual refresh function
   */
  const refreshFeed = useCallback(async () => {
    logger.debug('[useRealSocialFeed] Manual refresh triggered');
    await refetch();
  }, [refetch]);

  /**
   * Handle like interaction with optimistic updates
   */
  const handleLike = useCallback(async (postId: string) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Optimistic update
      queryClient.setQueryData<SocialPost[]>(
        ['social-feed', organizationId],
        (old = []) => old.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked: !post.is_liked, 
                likes_count: post.likes_count + (post.is_liked ? -1 : 1) 
              }
            : post
        )
      );

      await createInteraction(
        postId,
        user.id,
        'like'
      );

      logger.debug('[useRealSocialFeed] Like interaction created', { postId });
      return true;
    } catch (error) {
      logger.error('[useRealSocialFeed] Like error', error);
      
      // Revert optimistic update on error
      await refetch();
      
      // Check if error is due to deleted post
      const errorMessage = error instanceof Error ? error.message : 'Failed to like post';
      
      if (errorMessage.includes('no longer available')) {
        toast({
          title: "Post unavailable",
          description: "This post has been deleted by the author.",
          variant: "default"
        });
        // Remove the post from the feed
        queryClient.setQueryData<SocialPost[]>(
          ['social-feed', organizationId],
          (old = []) => old.filter(post => post.id !== postId)
        );
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return false;
    }
  }, [user, toast, queryClient, organizationId, refetch]);

  /**
   * Handle bookmark interaction with optimistic updates
   */
  const handleBookmark = useCallback(async (postId: string) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Optimistic update
      queryClient.setQueryData<SocialPost[]>(
        ['social-feed', organizationId],
        (old = []) => old.map(post => 
          post.id === postId 
            ? { ...post, is_bookmarked: !post.is_bookmarked }
            : post
        )
      );

      await createInteraction(
        postId,
        user.id,
        'bookmark'
      );

      logger.debug('[useRealSocialFeed] Bookmark interaction created', { postId });
      return true;
    } catch (error) {
      logger.error('[useRealSocialFeed] Bookmark error', error);
      
      // Revert optimistic update on error
      await refetch();
      
      // Check if error is due to deleted post
      const errorMessage = error instanceof Error ? error.message : 'Failed to bookmark post';
      
      if (errorMessage.includes('no longer available')) {
        toast({
          title: "Post unavailable",
          description: "This post has been deleted by the author.",
          variant: "default"
        });
        // Remove the post from the feed
        queryClient.setQueryData<SocialPost[]>(
          ['social-feed', organizationId],
          (old = []) => old.filter(post => post.id !== postId)
        );
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return false;
    }
  }, [user, toast, queryClient, organizationId, refetch]);

  /**
   * Handle share interaction
   */
  const handleShare = useCallback(async (postId: string) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to share posts",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Optimistic update for share count
      queryClient.setQueryData<SocialPost[]>(
        ['social-feed', organizationId],
        (old = []) => old.map(post => 
          post.id === postId 
            ? { ...post, shares_count: post.shares_count + 1 }
            : post
        )
      );

      await createInteraction(
        postId,
        user.id,
        'share'
      );

      toast({
        title: "Post shared!",
        description: "The post has been shared to your network."
      });

      logger.debug('[useRealSocialFeed] Share interaction created', { postId });
      return true;
    } catch (error) {
      logger.error('[useRealSocialFeed] Share error', error);
      
      // Revert optimistic update on error
      await refetch();
      
      // Check if error is due to deleted post
      const errorMessage = error instanceof Error ? error.message : 'Failed to share post';
      
      if (errorMessage.includes('no longer available')) {
        toast({
          title: "Post unavailable",
          description: "This post has been deleted by the author.",
          variant: "default"
        });
        // Remove the post from the feed
        queryClient.setQueryData<SocialPost[]>(
          ['social-feed', organizationId],
          (old = []) => old.filter(post => post.id !== postId)
        );
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return false;
    }
  }, [user, toast, queryClient, organizationId, refetch]);

  /**
   * Handle comment addition with optimistic updates
   */
  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: "Invalid comment",
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Optimistic update for comment count
      queryClient.setQueryData<SocialPost[]>(
        ['social-feed', organizationId],
        (old = []) => old.map(post => 
          post.id === postId 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      );

      await createInteraction(
        postId,
        user.id,
        'comment',
        content.trim()
      );

      toast({
        title: "Comment added!",
        description: "Your comment has been posted."
      });

      logger.debug('[useRealSocialFeed] Comment interaction created', { postId });
      return true;
    } catch (error) {
      logger.error('[useRealSocialFeed] Comment error', error);
      
      // Revert optimistic update on error
      await refetch();
      
      // Check if error is due to deleted post
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      
      if (errorMessage.includes('no longer available')) {
        toast({
          title: "Post unavailable",
          description: "This post has been deleted by the author.",
          variant: "default"
        });
        // Remove the post from the feed
        queryClient.setQueryData<SocialPost[]>(
          ['social-feed', organizationId],
          (old = []) => old.filter(post => post.id !== postId)
        );
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return false;
    }
  }, [user, toast, queryClient, organizationId, refetch]);

  return {
    posts,
    loading,
    refreshing: isRefetching,
    refreshFeed,
    handleLike,
    handleBookmark,
    handleShare,
    handleAddComment,
    // Legacy properties for backward compatibility
    page: 0,
    hasMore: false,
    loadMore: () => Promise.resolve()
  };
};
