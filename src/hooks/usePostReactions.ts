
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
      return;
    }

    const actualPostId = getActualPostId(postId);
    const existingReaction = reactions.find(r => r.userReacted);

    // OPTIMISTIC UPDATE - Update UI immediately
    setReactions(prev => {
      // Remove user's existing reaction if any
      let updated = prev.map(r => ({
        ...r,
        userReacted: false,
        count: r.userReacted ? r.count - 1 : r.count,
        users: r.userReacted && r.users 
          ? r.users.filter(u => u.id !== user.id) 
          : r.users
      }));

      // Add or toggle the new reaction
      const reactionIndex = updated.findIndex(r => r.emoji === emoji);
      
      if (existingReaction?.emoji === emoji) {
        // Same emoji clicked - remove it
        updated = updated.map(r => 
          r.emoji === emoji 
            ? { ...r, count: Math.max(0, r.count - 1), userReacted: false }
            : r
        );
      } else {
        // Different emoji or no existing reaction
        if (reactionIndex >= 0) {
          // Emoji exists, increment count and add user
          const currentReaction = updated[reactionIndex];
          updated[reactionIndex] = {
            ...currentReaction,
            count: currentReaction.count + 1,
            userReacted: true,
            users: [
              ...(currentReaction.users || []),
              { id: user.id, name: 'You', avatar: undefined }
            ]
          };
        } else {
          // New emoji, add it
          updated.push({
            emoji,
            count: 1,
            userReacted: true,
            users: [{ id: user.id, name: 'You', avatar: undefined }]
          });
        }
      }

      return updated.filter(r => r.count > 0); // Remove reactions with 0 count
    });

    // API CALL IN BACKGROUND
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

      // Sync with actual database state (in case of concurrent updates)
      await fetchReactions();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      
      // REVERT OPTIMISTIC UPDATE on error
      await fetchReactions();
      
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, postId, reactions, fetchReactions, toast]);

  // Set up real-time subscription for reaction updates
  useEffect(() => {
    if (!postId) return;

    const actualPostId = getActualPostId(postId);

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
