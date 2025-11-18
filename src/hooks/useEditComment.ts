import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/services/queryKeys";
import { Comment } from "@/types/feed";
import { formatDistanceToNow } from "date-fns";

interface EditCommentData {
  commentId: string;
  postId: string;
  newContent: string;
}

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

export const useEditComment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, newContent }: EditCommentData) => {
      if (!user?.id) {
        throw new Error("User must be authenticated to edit a comment");
      }

      const { data, error } = await supabase
        .from("post_interactions")
        .update({
          content: newContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onMutate: async ({ commentId, postId, newContent }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId)
      );

      // Optimistically update the cache
      if (previousComments) {
        const updatedComments = updateCommentInTree(previousComments, commentId, {
          content: newContent,
          editedAt: formatDistanceToNow(new Date(), { addSuffix: true }),
        });

        queryClient.setQueryData(QUERY_KEYS.POST_COMMENTS(postId), updatedComments);
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
        title: "Error",
        description: "Failed to edit comment. Please try again.",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment edited successfully",
      });
    },

    onSettled: (data, error, { postId }) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEED_POSTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS });
    },
  });
};
