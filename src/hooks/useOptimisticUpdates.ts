
import { useQueryClient } from '@tanstack/react-query';
import { PostWithProfile } from '@/services/realPostsService';

export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticLike = (postId: string, isLiked: boolean) => {
    queryClient.setQueryData(['posts'], (oldData: PostWithProfile[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(post => {
        if (post.id === postId && post.interactions) {
          return {
            ...post,
            interactions: {
              ...post.interactions,
              user_liked: isLiked,
              like_count: isLiked 
                ? post.interactions.like_count + 1 
                : Math.max(0, post.interactions.like_count - 1)
            }
          };
        }
        return post;
      });
    });
  };

  const optimisticComment = (postId: string, content: string, userProfile?: { first_name?: string; last_name?: string; avatar_url?: string }) => {
    queryClient.setQueryData(['posts'], (oldData: PostWithProfile[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `temp-${Date.now()}`, // Temporary ID for optimistic update
            author: userProfile 
              ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'You'
              : 'You',
            avatar: userProfile?.avatar_url || '',
            content,
            timestamp: 'Just now',
            likes: 0,
            isLiked: false,
            user_id: 'current-user', // Will be replaced with actual data
            created_at: new Date().toISOString()
          };

          return {
            ...post,
            interactions: post.interactions ? {
              ...post.interactions,
              comment_count: post.interactions.comment_count + 1
            } : { like_count: 0, comment_count: 1, user_liked: false },
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      });
    });
  };

  const revertOptimisticUpdate = () => {
    // Invalidate to get fresh data if optimistic update fails
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  return {
    optimisticLike,
    optimisticComment,
    revertOptimisticUpdate
  };
};
