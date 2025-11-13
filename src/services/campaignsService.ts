
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  category: string;
  urgency: string;
  location: string | null;
  current_amount: number;
  goal_amount: number | null;
  organizer: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
  tags: string[];
  featured_image: string | null;
  participant_count?: number;
  is_participating?: boolean;
  progress?: number;
  timeLeft?: string;
  impact?: string;
}

export interface CampaignParticipant {
  id: string;
  campaign_id: string;
  user_id: string;
  participant_type: string;
  joined_at: string;
}

// Fetch all campaigns
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_participants(count)
        `)
        .eq('status', 'active');
      
      if (error) throw error;
      
      return data?.map(campaign => {
        const participantCount = campaign.campaign_participants?.[0]?.count || 0;
        const progress = campaign.goal_amount 
          ? Math.round((campaign.current_amount / campaign.goal_amount) * 100)
          : 0;
        
        // Calculate time left (mock for now)
        const createdDate = new Date(campaign.created_at);
        const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const timeLeft = daysSinceCreated > 30 ? '1 week left' : `${30 - daysSinceCreated} days left`;
        
        return {
          ...campaign,
          participant_count: participantCount,
          progress,
          timeLeft,
          impact: `${participantCount} people helped so far`
        };
      }) || [];
    }
  });
};

// Check if user is participating in campaigns
export const useUserCampaignParticipation = () => {
  return useQuery({
    queryKey: ['user-campaign-participation'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('campaign_participants')
        .select('campaign_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(p => p.campaign_id) || [];
    }
  });
};

// Join a campaign
export const useJoinCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaign_participants')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          participant_type: 'volunteer'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['campaigns'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['user-campaign-participation'],
        refetchType: 'none'
      });
      toast({
        title: "Joined campaign!",
        description: "You're now participating in this community campaign.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error joining campaign",
        description: error.message || "Failed to join campaign",
        variant: "destructive",
      });
    }
  });
};

// Leave a campaign
export const useLeaveCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('campaign_participants')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['campaigns'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['user-campaign-participation'],
        refetchType: 'none'
      });
      toast({
        title: "Left campaign",
        description: "You're no longer participating in this campaign.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error leaving campaign",
        description: error.message || "Failed to leave campaign",
        variant: "destructive",
      });
    }
  });
};
