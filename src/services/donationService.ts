
import { supabase } from '@/integrations/supabase/client';

export interface DonationData {
  campaignId: string;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
}

export interface DonationProcessingResult {
  success: boolean;
  donationId?: string;
  transactionId?: string;
  error?: string;
}

export class DonationService {
  static async processDonation(data: DonationData): Promise<DonationProcessingResult> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Insert donation record
      const { data: donation, error } = await supabase
        .from('campaign_donations')
        .insert({
          campaign_id: data.campaignId,
          donor_id: user.user?.id,
          amount: data.amount,
          currency: data.currency,
          donation_type: 'one_time',
          is_anonymous: data.isAnonymous,
          donor_message: data.message,
          payment_processor: data.paymentMethod,
          payment_status: 'pending',
          source: 'campaign_page',
          device_type: 'desktop'
        })
        .select()
        .single();

      if (error) throw error;

      // Update campaign current amount using raw SQL since function isn't in types
      const { error: updateError } = await supabase.rpc('update_campaign_amount' as any, {
        campaign_uuid: data.campaignId,
        donation_amount: data.amount
      });

      if (updateError) throw updateError;

      // Track engagement
      await this.trackDonationEngagement(data.campaignId, user.user?.id);

      return {
        success: true,
        donationId: donation.id,
        transactionId: `txn_${donation.id.substring(0, 8)}`
      };
    } catch (error) {
      console.error('Donation processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static async trackDonationEngagement(campaignId: string, userId?: string) {
    await supabase
      .from('campaign_engagement')
      .insert({
        campaign_id: campaignId,
        user_id: userId,
        action_type: 'donation',
        device_type: 'desktop'
      });
  }

  static async getDonationStats(campaignId: string) {
    const { data: donations } = await supabase
      .from('campaign_donations')
      .select('amount, created_at, is_anonymous')
      .eq('campaign_id', campaignId)
      .eq('payment_status', 'completed');

    const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const donorCount = donations?.length || 0;
    const averageDonation = donorCount > 0 ? totalAmount / donorCount : 0;

    return {
      totalAmount,
      donorCount,
      averageDonation,
      recentDonations: donations?.slice(-5) || []
    };
  }
}
