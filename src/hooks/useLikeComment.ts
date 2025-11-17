import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/types/feed';

interface LikeCommentData {
  commentId: string;
  postId: string;
}

export const useLikeComment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ commentId }: LikeCommentData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .rpc('toggle_comment_like', { target_comment_id: commentId });

      if (error) throw error;

      return data; // Returns true if liked, false if unliked
    },

    onMutate: async ({ commentId, postId }: LikeCommentData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId)
      );

      // Helper function to update comment in nested structure
      const updateCommentInTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            // Toggle the like
            const newIsLiked = !comment.isLiked;
            return {
              ...comment,
              isLiked: newIsLiked,
              likes: newIsLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1),
            };
          }
          // Check in replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies),
            };
          }
          return comment;
        });
      };

      // Optimistically update the cache
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId),
        (old = []) => updateCommentInTree(old)
      );

      return { previousComments, postId };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          QUERY_KEYS.POST_COMMENTS(context.postId),
          context.previousComments
        );
      }

      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });

      console.error('Error liking comment:', err);
    },

    onSuccess: (isLiked) => {
      // Optional: Show success toast
      // toast({
      //   title: isLiked ? "Comment liked!" : "Like removed",
      //   description: isLiked ? "Your reaction has been recorded" : "Your like has been removed"
      // });
    },

    onSettled: (data, error, variables) => {
      // Invalidate and refetch in the background
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(variables.postId) });
    },
  });
};
