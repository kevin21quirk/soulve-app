
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

  const optimisticComment = (postId: string) => {
    queryClient.setQueryData(['posts'], (oldData: PostWithProfile[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(post => {
        if (post.id === postId && post.interactions) {
          return {
            ...post,
            interactions: {
              ...post.interactions,
              comment_count: post.interactions.comment_count + 1
            }
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
