
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

  // Extract the actual UUID from campaign IDs
  const getActualPostId = (id: string) => {
    if (id.startsWith('campaign_')) {
      return id.replace('campaign_', '');
    }
    return id;
  };

  const fetchReactions = useCallback(async () => {
    if (!postId) return;

    const actualPostId = getActualPostId(postId);
    console.log('Fetching reactions for post:', actualPostId);
    
    try {
      // Get reaction counts and user reaction status
      const { data: reactionCounts, error: countsError } = await supabase
        .rpc('get_post_reaction_counts', { target_post_id: actualPostId });

      if (countsError) {
        console.error('Error fetching reaction counts:', countsError);
        setReactions([]);
        setLoading(false);
        return;
      }

      console.log('Reaction counts received:', reactionCounts);

      // Get detailed user information for each reaction type
      const reactionsWithUsers: ReactionData[] = [];

      for (const reaction of reactionCounts || []) {
        const { data: reactionUsers, error: usersError } = await supabase
          .from('post_reactions')
          .select(`
            user_id,
            profiles:user_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('post_id', actualPostId)
          .eq('reaction_type', reaction.reaction_type);

        if (usersError) {
          console.warn('Could not fetch reaction users, using count only:', usersError.message);
          reactionsWithUsers.push({
            emoji: reaction.reaction_type,
            count: Number(reaction.count),
            userReacted: reaction.user_reacted,
            users: []
          });
          continue;
        }

        const users = reactionUsers?.map(r => {
          const profile = r.profiles as any;
          return {
            id: r.user_id,
            name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
            avatar: profile?.avatar_url || undefined
          };
        }) || [];

        reactionsWithUsers.push({
          emoji: reaction.reaction_type,
          count: Number(reaction.count),
          userReacted: reaction.user_reacted,
          users
        });
      }

      console.log('Final reactions with users:', reactionsWithUsers);
      setReactions(reactionsWithUsers);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const toggleReaction = useCallback(async (emoji: string) => {
    if (!user || !postId) {
      console.warn('Cannot toggle reaction: missing user or postId', { user: !!user, postId });
      return;
    }

    const actualPostId = getActualPostId(postId);
    console.log('Toggling reaction:', emoji, 'for post:', actualPostId);

    try {
      const { data: result, error } = await supabase
        .rpc('toggle_post_reaction', {
          target_post_id: actualPostId,
          target_reaction_type: emoji
        });

      if (error) {
        console.error('Error toggling reaction:', error);
        throw error;
      }

      console.log('Toggle reaction result:', result);

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

    const actualPostId = getActualPostId(postId);
    console.log('Setting up real-time subscription for post:', actualPostId);

    const channel = supabase
      .channel(`post-reactions-${actualPostId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${actualPostId}`
        },
        (payload) => {
          console.log('Real-time reaction update:', payload);
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription for post:', actualPostId);
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
