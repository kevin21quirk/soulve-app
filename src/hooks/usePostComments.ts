import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/feed';
import { formatDistanceToNow } from 'date-fns';
import { fetchComments as fetchCommentsService, getInteractionTarget } from '@/services/interactionRoutingService';

interface RawComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  author_name: string;
  author_avatar: string | null;
  likes_count: number;
  user_has_liked: boolean;
}

export const usePostComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformComment = (raw: RawComment): Comment => ({
    id: raw.id,
    author: raw.author_name,
    authorId: raw.user_id,
    avatar: raw.author_avatar || '',
    content: raw.content,
    timestamp: formatDistanceToNow(new Date(raw.created_at), { addSuffix: true }),
    likes: Number(raw.likes_count),
    isLiked: raw.user_has_liked,
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

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchCommentsService(postId, user?.id);

      const transformed = (data as RawComment[]).map(transformComment);
      const organized = organizeComments(transformed);
      setComments(organized);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId, user?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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
            console.log('New comment detected, refreshing...');
            fetchComments();
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
            console.log('Comment updated, refreshing...');
            fetchComments();
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
          console.log('Comment deleted, refreshing...');
          fetchComments();
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
          console.log('Comment like changed, refreshing...');
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(likesChannel);
    };
  }, [postId, fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments
  };
};
