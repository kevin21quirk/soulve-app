import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CampaignDonationService } from '@/services/campaignDonationService';

export interface CampaignStats {
  donorCount: number;
  recentDonations24h: number;
  recentDonors: Array<{
    id: string;
    avatar?: string;
    name?: string;
    isAnonymous: boolean;
    amount: number;
    createdAt: string;
  }>;
  averageDonation: number;
  progressPercentage: number;
  daysRemaining: number | null;
  isOngoing: boolean;
}

export const useCampaignStats = (
  campaignId: string, 
  goalAmount: number,
  currentAmount: number,
  endDate?: string | null
) => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['campaign-stats', campaignId],
    queryFn: async (): Promise<CampaignStats> => {
      if (!campaignId) {
        return {
          donorCount: 0,
          recentDonations24h: 0,
          recentDonors: [],
          averageDonation: 0,
          progressPercentage: 0,
          daysRemaining: null,
          isOngoing: false
        };
      }
      // Fetch donations
      const { data: donations } = await supabase
        .from('campaign_donations')
        .select('donor_id, amount, is_anonymous, created_at')
        .eq('campaign_id', campaignId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      // Fetch donor profiles for recent donations
      const recentDonorIds = donations?.slice(0, 5).map(d => d.donor_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', recentDonorIds);

      // Calculate stats
      const donorCount = donations?.length || 0;
      const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
      const averageDonation = donorCount > 0 ? totalDonated / donorCount : 0;

      // Recent donations in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentDonations24h = donations?.filter(d => d.created_at > oneDayAgo).length || 0;

      // Recent donors with profiles
      const recentDonors = donations?.slice(0, 5).map(donation => {
        const profile = profiles?.find(p => p.id === donation.donor_id);
        return {
          id: donation.donor_id || 'anonymous',
          avatar: profile?.avatar_url,
          name: profile ? `${profile.first_name} ${profile.last_name}` : undefined,
          isAnonymous: donation.is_anonymous,
          amount: donation.amount,
          createdAt: donation.created_at
        };
      }) || [];

      // Progress percentage
      const progressPercentage = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;

      // Days remaining
      const isOngoing = !endDate;
      const daysRemaining = endDate 
        ? Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        donorCount,
        recentDonations24h,
        recentDonors,
        averageDonation,
        progressPercentage,
        daysRemaining,
        isOngoing
      };
    },
    enabled: !!campaignId,
    staleTime: 30000, // 30 seconds
  });

  // Real-time subscriptions are now handled at the feed level for better performance

  return { stats, isLoading };
};
