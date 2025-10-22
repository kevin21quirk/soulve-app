import { supabase } from '@/integrations/supabase/client';
import { ImpactAnalyticsService } from '@/services/impactAnalyticsService';
import { YapilyService } from './yapilyService';

export interface DonationData {
  campaignId: string;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod: 'yapily' | 'bank_transfer';
}

export interface DonationProcessingResult {
  success: boolean;
  donationId?: string;
  transactionId?: string;
  paymentDetails?: any;
  error?: string;
}

export class DonationService {
  static async processDonation(data: DonationData): Promise<DonationProcessingResult> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      let paymentDetails = null;
      let paymentStatus = 'pending';

      // Process payment based on method
      if (data.paymentMethod === 'yapily') {
        // Create Yapily payment
        const yapilyResponse = await YapilyService.createPaymentConsent({
          amount: data.amount,
          currency: data.currency,
          description: `Donation to campaign`,
          reference: `DON-${Date.now()}`,
          userId: user.user?.id
        });
        
        paymentDetails = yapilyResponse;
        paymentStatus = 'pending';
        
      } else if (data.paymentMethod === 'bank_transfer') {
        // Generate payment reference
        const bankTransferResponse = await YapilyService.generatePaymentReference(
          data.amount,
          'donation',
          user.user?.id
        );
        
        paymentDetails = bankTransferResponse;
        paymentStatus = 'awaiting_confirmation';
      }
      
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
          payment_status: paymentStatus,
          source: 'campaign_page',
          device_type: 'desktop'
        })
        .select()
        .single();

      if (error) throw error;

      // Only update campaign amount and award points if payment is completed
      // For pending payments, these will be triggered by webhooks later
      if (paymentStatus === 'completed') {
        // Update campaign current amount using raw SQL since function isn't in types
        const { error: updateError } = await supabase.rpc('update_campaign_amount' as any, {
          campaign_uuid: data.campaignId,
          donation_amount: data.amount
        });

        if (updateError) throw updateError;

        // Track engagement
        await this.trackDonationEngagement(data.campaignId, user.user?.id);

        // Track impact points for donation
        if (user.user?.id) {
          const points = Math.floor(data.amount * 0.1); // 10% of donation amount as points
          await ImpactAnalyticsService.awardImpactPoints(
            user.user.id,
            'donation',
            points,
            `Donated ${data.currency} ${data.amount} to campaign`,
            {
              campaignId: data.campaignId,
              amount: data.amount,
              currency: data.currency,
              paymentMethod: data.paymentMethod,
              donationId: donation.id
            }
          );
        }
      }

      return {
        success: true,
        donationId: donation.id,
        transactionId: `txn_${donation.id.substring(0, 8)}`,
        paymentDetails
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
