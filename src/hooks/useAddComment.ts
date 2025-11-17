import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/services/queryKeys';
import { createInteraction } from '@/services/interactionRoutingService';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/types/feed';

interface AddCommentData {
  postId: string;
  content: string;
  organizationId?: string | null;
}

export const useAddComment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, content, organizationId }: AddCommentData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      await createInteraction(
        postId,
        user.id,
        'comment',
        content,
        organizationId
      );
    },

    onMutate: async ({ postId, content }) => {
      // Cancel any outgoing refetches to avoid race conditions
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId)
      );

      // Fetch user profile data for the optimistic comment
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user?.id)
        .single();

      const userName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
        : 'Unknown User';
      const userAvatar = profile?.avatar_url || '';

      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        author: userName,
        authorId: user?.id || '',
        avatar: userAvatar,
        content,
        timestamp: 'just now',
        likes: 0,
        isLiked: false,
        isOrganization: false,
        isDeleted: false,
        replies: [],
      };

      // Optimistically update the cache - add at beginning since newest are shown first
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId),
        (old = []) => [optimisticComment, ...old]
      );

      // Return context for rollback
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
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });

      console.error('Error adding comment:', err);
    },

    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: "Your comment has been posted",
      });
    },

    onSettled: (data, error, variables) => {
      // Invalidate and refetch in the background
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(variables.postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEED_POSTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS });
    },
  });
};
