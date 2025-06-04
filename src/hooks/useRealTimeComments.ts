
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RealTimeComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_liked: boolean;
}

export const useRealTimeComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<RealTimeComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('post_interactions')
        .select(`
          id,
          post_id,
          user_id,
          content,
          created_at,
          profiles!inner(first_name, last_name, avatar_url)
        `)
        .eq('post_id', postId)
        .eq('interaction_type', 'comment')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentData: RealTimeComment[] = (data || []).map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        user_id: comment.user_id,
        user_name: `${comment.profiles.first_name || ''} ${comment.profiles.last_name || ''}`.trim(),
        user_avatar: comment.profiles.avatar_url || undefined,
        content: comment.content || '',
        created_at: comment.created_at,
        likes_count: 0,
        user_liked: false
      }));

      setComments(commentData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content: string) => {
    if (!user || !postId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'comment',
          content: content.trim()
        });

      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, [user, postId, fetchComments]);

  useEffect(() => {
    if (postId) {
      fetchComments();

      // Set up real-time subscription
      const channel = supabase
        .channel(`post-comments-${postId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'post_interactions',
          filter: `post_id=eq.${postId}`
        }, () => {
          fetchComments();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [postId, fetchComments]);

  return {
    comments,
    loading,
    addComment,
    commentCount: comments.length
  };
};
