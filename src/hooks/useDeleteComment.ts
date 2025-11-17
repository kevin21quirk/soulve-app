import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { QUERY_KEYS } from '@/services/queryKeys';
import { Comment } from '@/types/feed';
import { getInteractionTarget } from '@/services/interactionRoutingService';

interface DeleteCommentData {
  commentId: string;
  postId: string;
}

// Helper function to recursively update a comment in the nested tree
const updateCommentInTree = (
  comments: Comment[],
  commentId: string,
  update: Partial<Comment>
): Comment[] => {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return { ...comment, ...update };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, update)
      };
    }
    return comment;
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ commentId, postId }: DeleteCommentData) => {
      if (!user) {
        throw new Error('You must be logged in to delete comments');
      }

      const target = getInteractionTarget(postId);
      
      const { error } = await supabase
        .from(target.tableName)
        .update({
          is_deleted: true,
          content: '[deleted]'
        })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
    },

    onMutate: async ({ commentId, postId }: DeleteCommentData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.POST_COMMENTS(postId) 
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId)
      );

      // Optimistically update the comment to show deleted state
      if (previousComments) {
        const updatedComments = updateCommentInTree(
          previousComments,
          commentId,
          { 
            isDeleted: true, 
            content: '[deleted]' 
          }
        );
        
        queryClient.setQueryData(
          QUERY_KEYS.POST_COMMENTS(postId),
          updatedComments
        );
      }

      return { previousComments };
    },

    onError: (error, { postId }, context) => {
      // Rollback to previous state
      if (context?.previousComments) {
        queryClient.setQueryData(
          QUERY_KEYS.POST_COMMENTS(postId),
          context.previousComments
        );
      }
      
      toast({
        title: 'Failed to delete comment',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },

    onSuccess: () => {
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been deleted successfully',
      });
    },

    onSettled: (data, error, { postId }) => {
      // Invalidate queries to refetch in background
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.POST_COMMENTS(postId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.FEED_POSTS 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.POSTS 
      });
    },
  });
};
