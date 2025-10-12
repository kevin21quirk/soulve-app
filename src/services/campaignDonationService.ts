import { supabase } from '@/integrations/supabase/client';

export interface DonorInfo {
  id: string;
  avatar: string;
  name: string;
  isAnonymous: boolean;
}

export interface DonationStats {
  donorCount: number;
  recentDonations24h: number;
  recentDonors: DonorInfo[];
  averageDonation: number;
  totalAmount: number;
}

export const CampaignDonationService = {
  async getDonationStats(campaignId: string): Promise<DonationStats> {
    try {
      // Get all donations for the campaign
      const { data: donations, error } = await supabase
        .from('campaign_donations')
        .select('id, amount, created_at, is_anonymous, donor_id')
        .eq('campaign_id', campaignId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Calculate stats
      const donorCount = new Set(donations?.map(d => d.donor_id)).size || 0;
      const recentDonations24h = donations?.filter(d => 
        new Date(d.created_at) > twentyFourHoursAgo
      ).length || 0;
      
      const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
      const averageDonation = donorCount > 0 ? totalAmount / donorCount : 0;

      // Get donor profiles
      const donorIds = [...new Set(donations?.map(d => d.donor_id).filter(Boolean))] as string[];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', donorIds);
      
      // Get recent unique donors (last 5)
      const seenDonors = new Set<string>();
      const recentDonors: DonorInfo[] = [];
      
      for (const donation of donations || []) {
        if (recentDonors.length >= 5) break;
        if (donation.donor_id && !seenDonors.has(donation.donor_id)) {
          seenDonors.add(donation.donor_id);
          
          if (donation.is_anonymous) {
            recentDonors.push({
              id: donation.id,
              avatar: '',
              name: 'Anonymous',
              isAnonymous: true
            });
          } else {
            const profile = profiles?.find(p => p.id === donation.donor_id);
            if (profile) {
              const donorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
              recentDonors.push({
                id: profile.id,
                avatar: profile.avatar_url || '',
                name: donorName || 'Anonymous',
                isAnonymous: false
              });
            }
          }
        }
      }

      return {
        donorCount,
        recentDonations24h,
        recentDonors,
        averageDonation,
        totalAmount
      };
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      return {
        donorCount: 0,
        recentDonations24h: 0,
        recentDonors: [],
        averageDonation: 0,
        totalAmount: 0
      };
    }
  },

  async subscribeToDonations(campaignId: string, callback: () => void) {
    const channel = supabase
      .channel(`campaign-donations-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaign_donations',
          filter: `campaign_id=eq.${campaignId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }
};
