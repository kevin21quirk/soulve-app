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
  const [comments, setComments] = useState<Comment[]>([]);
  const [optimisticComments, setOptimisticComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const addOptimisticComment = useCallback((content: string) => {
    if (!user) return null;
    
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content,
      author: 'You',
      authorId: user.id,
      avatar: '',
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      isOrganization: false,
      replies: [],
      isDeleted: false
    };
    
    setOptimisticComments(prev => [...prev, tempComment]);
    return tempComment;
  }, [user]);

  const removeOptimisticComment = useCallback((id: string) => {
    setOptimisticComments(prev => prev.filter(c => c.id !== id));
  }, []);

  const removeComment = useCallback((id: string) => {
    setComments(prev => {
      const filterComments = (comments: Comment[]): Comment[] => {
        return comments.filter(c => {
          if (c.id === id) return false;
          if (c.replies && c.replies.length > 0) {
            c.replies = filterComments(c.replies);
          }
          return true;
        });
      };
      return filterComments(prev);
    });
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Merge optimistic comments with real comments
  const allComments = useCallback(() => {
    // Filter out optimistic comments that might have been added to real comments
    const filtered = optimisticComments.filter(opt => 
      !comments.find(c => 
        c.content === opt.content && 
        c.authorId === opt.authorId &&
        Math.abs(new Date(c.timestamp).getTime() - Date.now()) < 10000
      )
    );
    return [...comments, ...filtered];
  }, [comments, optimisticComments]);

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
    comments: allComments(),
    loading,
    error,
    refetch: fetchComments,
    addOptimisticComment,
    removeOptimisticComment,
    removeComment
  };
};
