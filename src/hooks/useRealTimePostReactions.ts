
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'helpful' | 'support';
  created_at: string;
}

export const useRealTimePostReactions = (postId: string) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [userReaction, setUserReaction] = useState<PostReaction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReactions = useCallback(async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('post_interactions')
        .select('*')
        .eq('post_id', postId)
        .eq('interaction_type', 'like');

      if (error) throw error;

      const reactionData: PostReaction[] = (data || []).map(interaction => ({
        id: interaction.id,
        post_id: interaction.post_id,
        user_id: interaction.user_id,
        reaction_type: 'like',
        created_at: interaction.created_at
      }));

      setReactions(reactionData);
      
      if (user) {
        const myReaction = reactionData.find(r => r.user_id === user.id);
        setUserReaction(myReaction || null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  const addReaction = useCallback(async (type: PostReaction['reaction_type'] = 'like') => {
    if (!user || !postId) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'like'
        });

      if (error) throw error;
      fetchReactions();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [user, postId, fetchReactions]);

  const removeReaction = useCallback(async () => {
    if (!user || !userReaction) return;

    try {
      const { error } = await supabase
        .from('post_interactions')
        .delete()
        .eq('id', userReaction.id);

      if (error) throw error;
      fetchReactions();
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [user, userReaction, fetchReactions]);

  useEffect(() => {
    if (postId) {
      fetchReactions();

      // Set up real-time subscription
      const channel = supabase
        .channel(`post-reactions-${postId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'post_interactions',
          filter: `post_id=eq.${postId}`
        }, () => {
          fetchReactions();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [postId, fetchReactions]);

  return {
    reactions,
    userReaction,
    loading,
    addReaction,
    removeReaction,
    reactionCount: reactions.length
  };
};
