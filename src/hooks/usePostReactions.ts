
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReactionData {
  emoji: string;
  count: number;
  userReacted: boolean;
  users?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

export const usePostReactions = (postId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reactions, setReactions] = useState<ReactionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReactions = useCallback(async () => {
    if (!postId) return;

    try {
      // Get reaction counts and user reaction status
      const { data: reactionCounts, error: countsError } = await supabase
        .rpc('get_post_reaction_counts', { target_post_id: postId });

      if (countsError) throw countsError;

      // Get detailed user information for each reaction type
      const reactionsWithUsers: ReactionData[] = [];

      for (const reaction of reactionCounts || []) {
        const { data: reactionUsers, error: usersError } = await supabase
          .from('post_reactions')
          .select(`
            user_id,
            profiles!inner(first_name, last_name, avatar_url)
          `)
          .eq('post_id', postId)
          .eq('reaction_type', reaction.reaction_type);

        if (usersError) {
          console.error('Error fetching reaction users:', usersError);
          continue;
        }

        const users = reactionUsers?.map(r => ({
          id: r.user_id,
          name: `${r.profiles.first_name || ''} ${r.profiles.last_name || ''}`.trim() || 'Anonymous',
          avatar: r.profiles.avatar_url || undefined
        })) || [];

        reactionsWithUsers.push({
          emoji: reaction.reaction_type,
          count: Number(reaction.count),
          userReacted: reaction.user_reacted,
          users
        });
      }

      setReactions(reactionsWithUsers);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      toast({
        title: "Error",
        description: "Failed to load reactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [postId, toast]);

  const toggleReaction = useCallback(async (emoji: string) => {
    if (!user || !postId) return;

    try {
      const { data: result, error } = await supabase
        .rpc('toggle_post_reaction', {
          target_post_id: postId,
          target_reaction_type: emoji
        });

      if (error) throw error;

      // Refresh reactions after toggle
      await fetchReactions();

      // Show feedback based on whether reaction was added or removed
      if (result) {
        toast({
          title: "Reaction added!",
          description: `You reacted with ${emoji}`,
        });
      } else {
        toast({
          title: "Reaction removed",
          description: `You removed your ${emoji} reaction`,
        });
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    }
  }, [user, postId, fetchReactions, toast]);

  // Set up real-time subscription for reaction updates
  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`post-reactions-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, fetchReactions]);

  // Initial fetch
  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  return {
    reactions,
    loading,
    toggleReaction,
    refreshReactions: fetchReactions
  };
};
