import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export const useCampaignInteractions = (campaignId: string) => {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['campaign-interactions', campaignId],
    queryFn: async () => {
      if (!campaignId) return { likes: 0, comments: 0, shares: 0, bookmarks: 0, isLiked: false, isBookmarked: false };

      const { data: interactions, error } = await supabase
        .from('campaign_interactions')
        .select('interaction_type, user_id')
        .eq('campaign_id', campaignId);
      
      if (error) throw error;

      const likes = interactions?.filter(i => i.interaction_type === 'like').length || 0;
      const comments = interactions?.filter(i => i.interaction_type === 'comment').length || 0;
      const shares = interactions?.filter(i => i.interaction_type === 'share').length || 0;
      const bookmarks = interactions?.filter(i => i.interaction_type === 'bookmark').length || 0;
      
      const isLiked = user ? interactions?.some(i => i.interaction_type === 'like' && i.user_id === user.id) : false;
      const isBookmarked = user ? interactions?.some(i => i.interaction_type === 'bookmark' && i.user_id === user.id) : false;
      
      return { likes, comments, shares, bookmarks, isLiked, isBookmarked };
    },
    enabled: !!campaignId,
    staleTime: 10000
  });

  // Set up real-time subscription for campaign interactions
  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel(`campaign-interactions-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_interactions',
          filter: `campaign_id=eq.${campaignId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, refetch]);

  return {
    interactions: data || { likes: 0, comments: 0, shares: 0, bookmarks: 0, isLiked: false, isBookmarked: false },
    isLoading,
    refetch
  };
};
