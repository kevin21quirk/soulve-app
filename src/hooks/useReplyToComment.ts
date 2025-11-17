import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/contexts/AccountContext';
import { QUERY_KEYS } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/types/feed';

interface ReplyToCommentData {
  postId: string;
  parentCommentId: string;
  content: string;
  taggedUserIds?: string[];
}

export const useReplyToComment = () => {
  const { user } = useAuth();
  const { organizationId } = useAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, parentCommentId, content, taggedUserIds = [] }: ReplyToCommentData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const actualPostId = postId.startsWith('campaign_') 
        ? postId.replace('campaign_', '') 
        : postId;

      const { data: reply, error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: actualPostId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim(),
          parent_comment_id: parentCommentId,
          ...(organizationId && { organization_id: organizationId })
        })
        .select()
        .single();

      if (error) throw error;

      // Handle tagged users/orgs
      if (taggedUserIds.length > 0 && reply) {
        const taggedUsers: string[] = [];
        const taggedOrgs: string[] = [];
        
        for (const id of taggedUserIds) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .eq('id', id)
            .single();
          
          if (orgData) {
            taggedOrgs.push(id);
          } else {
            taggedUsers.push(id);
          }
        }

        // Insert user tags
        if (taggedUsers.length > 0) {
          const userTagInteractions = taggedUsers.map(userId => ({
            post_id: actualPostId,
            user_id: userId,
            interaction_type: 'user_tag',
            parent_comment_id: reply.id,
            content: null
          }));

          await supabase
            .from('post_interactions')
            .insert(userTagInteractions);

          // Create notifications
          const { data: taggerProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();

          const taggerName = taggerProfile 
            ? `${taggerProfile.first_name} ${taggerProfile.last_name}`.trim()
            : 'Someone';

          const notifications = taggedUsers.map(userId => ({
            recipient_id: userId,
            type: 'comment_tag',
            title: 'You were tagged',
            message: `${taggerName} tagged you in a comment`,
            action_url: `/posts/${actualPostId}#comment-${reply.id}`,
            action_type: 'view',
            priority: 'normal',
            metadata: {
              post_id: actualPostId,
              comment_id: reply.id,
              tagger_id: user.id
            }
          }));

          await supabase
            .from('notifications')
            .insert(notifications);
        }

        // Insert organization tags
        if (taggedOrgs.length > 0) {
          const orgTagInteractions = taggedOrgs.map(orgId => ({
            post_id: actualPostId,
            user_id: user.id,
            organization_id: orgId,
            interaction_type: 'user_tag',
            parent_comment_id: reply.id,
            content: null
          }));

          await supabase
            .from('post_interactions')
            .insert(orgTagInteractions);
        }
      }

      return reply;
    },

    onMutate: async ({ postId, parentCommentId, content }: ReplyToCommentData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId)
      );

      // Fetch user profile for optimistic reply
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user?.id)
        .single();

      const userName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
        : 'Unknown User';
      const userAvatar = profile?.avatar_url || '';

      // Create optimistic reply
      const optimisticReply: Comment = {
        id: `temp-reply-${Date.now()}`,
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
        parentCommentId: parentCommentId,
      };

      // Helper function to add reply to parent comment in nested structure
      const addReplyToTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), optimisticReply],
            };
          }
          // Check in nested replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToTree(comment.replies),
            };
          }
          return comment;
        });
      };

      // Optimistically update the cache
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.POST_COMMENTS(postId),
        (old = []) => addReplyToTree(old)
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
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });

      console.error('Error replying to comment:', err);
    },

    onSuccess: () => {
      toast({
        title: "Reply posted!",
        description: "Your reply has been added",
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
