import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/feed';
import { formatDistanceToNow } from 'date-fns';
import { fetchComments as fetchCommentsService, getInteractionTarget } from '@/services/interactionRoutingService';
import { QUERY_KEYS } from '@/services/queryKeys';

interface RawComment {
  id: string;
  post_id: string;
  user_id: string;
  organization_id: string | null;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  author_name: string;
  author_avatar: string | null;
  is_organization: boolean;
  likes_count: number;
  user_has_liked: boolean;
}

export const usePostComments = (postId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const transformComment = (raw: RawComment): Comment => ({
    id: raw.id,
    author: raw.author_name,
    authorId: raw.user_id,
    organizationId: raw.organization_id || undefined,
    avatar: raw.author_avatar || '',
    content: raw.content,
    timestamp: formatDistanceToNow(new Date(raw.created_at), { addSuffix: true }),
    likes: Number(raw.likes_count),
    isLiked: raw.user_has_liked,
    isOrganization: raw.is_organization,
    parentCommentId: raw.parent_comment_id || undefined,
    editedAt: raw.edited_at ? formatDistanceToNow(new Date(raw.edited_at), { addSuffix: true }) : undefined,
    isDeleted: raw.is_deleted,
    replies: []
  });

  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const { data: comments = [], isLoading: loading, error } = useQuery({
    queryKey: QUERY_KEYS.POST_COMMENTS(postId),
    queryFn: async (): Promise<Comment[]> => {
      if (!postId) return [];

      const data = await fetchCommentsService(postId, user?.id);
      const transformed = (data as RawComment[]).map(transformComment);
      return organizeComments(transformed);
    },
    enabled: !!postId,
    staleTime: 30000, // 30 seconds - comments change frequently
  });

  // Real-time subscription for new comments
  useEffect(() => {
    if (!postId) return;

    const target = getInteractionTarget(postId);
    const tableName = target.isCampaign ? 'campaign_interactions' : 'post_interactions';
    const filterColumn = target.isCampaign ? 'campaign_id' : 'post_id';

    const channel = supabase
      .channel(`comments:${target.actualId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
          filter: `${filterColumn}=eq.${target.actualId}`
        },
        (payload) => {
          if (payload.new.interaction_type === 'comment') {
            console.log('New comment detected, invalidating cache...');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
          filter: `${filterColumn}=eq.${target.actualId}`
        },
        (payload) => {
          if (payload.new.interaction_type === 'comment') {
            console.log('Comment updated, invalidating cache...');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: tableName
        },
        () => {
          console.log('Comment deleted, invalidating cache...');
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });
        }
      )
      .subscribe();

    // Also subscribe to comment likes changes
    const likesChannel = supabase
      .channel(`comment_likes:${target.actualId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes'
        },
        () => {
          console.log('Comment like changed, invalidating cache...');
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POST_COMMENTS(postId) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(likesChannel);
    };
  }, [postId, queryClient]);

  return {
    comments,
    loading,
    error: error ? String(error) : null,
  };
};
