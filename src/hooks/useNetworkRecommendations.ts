
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealConnections, useSuggestedConnections } from '@/services/realConnectionsService';
import { useUserGroups, useSuggestedGroups } from '@/services/groupsService';
import { useCampaigns } from '@/services/campaignsService';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface NetworkRecommendation {
  id: string;
  type: 'person' | 'group' | 'campaign';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  data: any;
}

export const useNetworkRecommendations = () => {
  const { user } = useAuth();
  const { data: connections = [] } = useRealConnections();
  const { data: suggestedConnections = [] } = useSuggestedConnections();
  const { data: userGroups = [] } = useUserGroups();
  const { data: suggestedGroups = [] } = useSuggestedGroups();
  const { data: campaigns = [] } = useCampaigns();

  // Get user profile with interests
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const recommendations = useMemo(() => {
    const recs: NetworkRecommendation[] = [];

    // Smart connection recommendations based on mutual interests
    suggestedConnections.slice(0, 3).forEach(profile => {
      const sharedInterests = profile.interests?.filter(interest => 
        userProfile?.interests?.includes(interest)
      ) || [];
      
      recs.push({
        id: profile.id,
        type: 'person',
        title: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
        description: profile.bio || 'Community member',
        reason: sharedInterests.length > 0 
          ? `Shares ${sharedInterests.length} interests with you`
          : 'Similar profile and location',
        confidence: Math.min(85 + (sharedInterests.length * 5), 100),
        data: profile
      });
    });

    // Group recommendations based on user interests
    suggestedGroups.slice(0, 2).forEach(group => {
      const relevanceScore = group.tags.filter(tag => 
        userProfile?.interests?.includes(tag)
      ).length;
      
      recs.push({
        id: group.id,
        type: 'group',
        title: group.name,
        description: group.description || 'Community group',
        reason: relevanceScore > 0 
          ? `Matches ${relevanceScore} of your interests`
          : 'Popular in your area',
        confidence: Math.min(70 + (relevanceScore * 10), 95),
        data: group
      });
    });

    // Campaign recommendations based on category preferences
    campaigns.slice(0, 2).forEach(campaign => {
      recs.push({
        id: campaign.id,
        type: 'campaign',
        title: campaign.title,
        description: campaign.description || 'Community campaign',
        reason: 'Making impact in your community',
        confidence: campaign.urgency === 'urgent' ? 90 : 75,
        data: campaign
      });
    });

    return recs.sort((a, b) => b.confidence - a.confidence);
  }, [suggestedConnections, suggestedGroups, campaigns, userProfile]);

  return { recommendations };
};
