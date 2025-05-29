
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalyticsTrackingOptions {
  campaignId: string;
  userId?: string;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  ip?: string;
  locationCountry?: string;
  locationCity?: string;
}

export const trackCampaignView = async (options: AnalyticsTrackingOptions) => {
  try {
    // Track in engagement table
    const { error: engagementError } = await supabase
      .from('campaign_engagement')
      .insert({
        campaign_id: options.campaignId,
        user_id: options.userId,
        action_type: 'view',
        session_id: options.sessionId,
        referrer_url: options.referrer,
        user_agent: options.userAgent,
        device_type: options.deviceType,
        location_country: options.locationCountry,
        location_city: options.locationCity,
        ip_address: options.ip
      });

    if (engagementError) {
      console.error('Error tracking campaign view engagement:', engagementError);
    }

    // Update analytics table
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', options.campaignId)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', fetchError);
    }

    if (existingAnalytics) {
      // Update existing analytics record
      const { error: updateError } = await supabase
        .from('campaign_analytics')
        .update({
          total_views: existingAnalytics.total_views + 1,
          unique_views: options.sessionId ? existingAnalytics.unique_views + 1 : existingAnalytics.unique_views
        })
        .eq('id', existingAnalytics.id);

      if (updateError) {
        console.error('Error updating analytics:', updateError);
      }
    } else {
      // Create new analytics record for today
      const { error: insertError } = await supabase
        .from('campaign_analytics')
        .insert({
          campaign_id: options.campaignId,
          date: new Date().toISOString().split('T')[0],
          total_views: 1,
          unique_views: options.sessionId ? 1 : 0
        });

      if (insertError) {
        console.error('Error creating analytics:', insertError);
      }
    }

    // Update campaign total_views directly
    const { data: campaign, error: campaignFetchError } = await supabase
      .from('campaigns')
      .select('total_views')
      .eq('id', options.campaignId)
      .single();

    if (!campaignFetchError && campaign) {
      const { error: campaignUpdateError } = await supabase
        .from('campaigns')
        .update({
          total_views: (campaign.total_views || 0) + 1
        })
        .eq('id', options.campaignId);

      if (campaignUpdateError) {
        console.error('Error updating campaign views:', campaignUpdateError);
      }
    }

    // Track geographic impact
    if (options.locationCountry) {
      const { data: existingGeo, error: geoFetchError } = await supabase
        .from('campaign_geographic_impact')
        .select('*')
        .eq('campaign_id', options.campaignId)
        .eq('country_code', options.locationCountry)
        .maybeSingle();

      if (geoFetchError && geoFetchError.code !== 'PGRST116') {
        console.error('Error fetching geographic impact:', geoFetchError);
      }

      if (existingGeo) {
        // Update existing geographic entry
        const { error: geoUpdateError } = await supabase
          .from('campaign_geographic_impact')
          .update({
            total_views: existingGeo.total_views + 1
          })
          .eq('id', existingGeo.id);

        if (geoUpdateError) {
          console.error('Error updating geographic impact:', geoUpdateError);
        }
      } else if (options.locationCountry) {
        // Create new geographic entry
        const { error: geoInsertError } = await supabase
          .from('campaign_geographic_impact')
          .insert({
            campaign_id: options.campaignId,
            country_code: options.locationCountry,
            country_name: options.locationCountry,
            city: options.locationCity,
            total_views: 1
          });

        if (geoInsertError) {
          console.error('Error creating geographic impact:', geoInsertError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in trackCampaignView:', error);
    return { success: false, error };
  }
};

export const trackCampaignShare = async (options: AnalyticsTrackingOptions & { platform: string }) => {
  try {
    // Track in engagement
    const { error: engagementError } = await supabase
      .from('campaign_engagement')
      .insert({
        campaign_id: options.campaignId,
        user_id: options.userId,
        action_type: 'share',
        session_id: options.sessionId,
        device_type: options.deviceType,
        location_country: options.locationCountry,
        location_city: options.locationCity,
      });

    if (engagementError) {
      console.error('Error tracking campaign share engagement:', engagementError);
    }

    // Track in social metrics
    const { error: socialError } = await supabase
      .from('campaign_social_metrics')
      .insert({
        campaign_id: options.campaignId,
        platform: options.platform,
        metric_type: 'share',
        value: 1,
        date: new Date().toISOString().split('T')[0]
      });

    if (socialError) {
      console.error('Error tracking social metrics:', socialError);
    }

    // Update analytics table
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', options.campaignId)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', fetchError);
    }

    if (existingAnalytics) {
      const { error: updateError } = await supabase
        .from('campaign_analytics')
        .update({
          social_shares: existingAnalytics.social_shares + 1
        })
        .eq('id', existingAnalytics.id);

      if (updateError) {
        console.error('Error updating analytics social shares:', updateError);
      }
    }

    // Update campaign total_shares directly
    const { data: campaign, error: campaignFetchError } = await supabase
      .from('campaigns')
      .select('total_shares')
      .eq('id', options.campaignId)
      .single();

    if (!campaignFetchError && campaign) {
      const { error: campaignUpdateError } = await supabase
        .from('campaigns')
        .update({
          total_shares: (campaign.total_shares || 0) + 1
        })
        .eq('id', options.campaignId);

      if (campaignUpdateError) {
        console.error('Error updating campaign shares:', campaignUpdateError);
      }
    }

    // Update geographic impact if location info exists
    if (options.locationCountry) {
      const { data: existingGeo, error: geoFetchError } = await supabase
        .from('campaign_geographic_impact')
        .select('*')
        .eq('campaign_id', options.campaignId)
        .eq('country_code', options.locationCountry)
        .maybeSingle();

      if (geoFetchError && geoFetchError.code !== 'PGRST116') {
        console.error('Error fetching geographic impact:', geoFetchError);
      }

      if (existingGeo) {
        const { error: geoUpdateError } = await supabase
          .from('campaign_geographic_impact')
          .update({
            total_shares: existingGeo.total_shares + 1
          })
          .eq('id', existingGeo.id);

        if (geoUpdateError) {
          console.error('Error updating geographic shares:', geoUpdateError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in trackCampaignShare:', error);
    return { success: false, error };
  }
};

export const trackDonation = async (donation: {
  campaignId: string;
  userId?: string;
  amount: number;
  currency?: string;
  donationType?: 'one_time' | 'recurring' | 'anonymous';
  source?: string;
  deviceType?: string;
  locationCountry?: string;
  locationCity?: string;
  isAnonymous?: boolean;
  message?: string;
  referrer?: string;
  paymentProcessor?: string;
}) => {
  try {
    // Add the donation record
    const { data: donationRecord, error: donationError } = await supabase
      .from('campaign_donations')
      .insert({
        campaign_id: donation.campaignId,
        donor_id: donation.userId,
        amount: donation.amount,
        currency: donation.currency || 'USD',
        donation_type: donation.donationType || 'one_time',
        source: donation.source || 'direct',
        device_type: donation.deviceType,
        location_country: donation.locationCountry,
        location_city: donation.locationCity,
        is_anonymous: donation.isAnonymous || false,
        donor_message: donation.message,
        referrer_url: donation.referrer,
        payment_processor: donation.paymentProcessor || 'worldpay',
        payment_status: 'completed'
      })
      .select()
      .single();

    if (donationError) {
      console.error('Error recording donation:', donationError);
      return { success: false, error: donationError };
    }

    // Update the campaign's current_amount directly
    const { data: campaign, error: campaignFetchError } = await supabase
      .from('campaigns')
      .select('current_amount')
      .eq('id', donation.campaignId)
      .single();

    if (!campaignFetchError && campaign) {
      const { error: campaignUpdateError } = await supabase
        .from('campaigns')
        .update({
          current_amount: (campaign.current_amount || 0) + donation.amount
        })
        .eq('id', donation.campaignId);

      if (campaignUpdateError) {
        console.error('Error updating campaign amount:', campaignUpdateError);
      }
    }

    // Update analytics table
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', donation.campaignId)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', fetchError);
    }

    if (existingAnalytics) {
      const { error: updateError } = await supabase
        .from('campaign_analytics')
        .update({
          total_donations: existingAnalytics.total_donations + 1,
          donation_amount: existingAnalytics.donation_amount + donation.amount
        })
        .eq('id', existingAnalytics.id);

      if (updateError) {
        console.error('Error updating analytics donations:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('campaign_analytics')
        .insert({
          campaign_id: donation.campaignId,
          date: new Date().toISOString().split('T')[0],
          total_donations: 1,
          donation_amount: donation.amount
        });

      if (insertError) {
        console.error('Error creating analytics for donation:', insertError);
      }
    }

    // Update geographic impact if location provided
    if (donation.locationCountry) {
      const { data: existingGeo, error: geoFetchError } = await supabase
        .from('campaign_geographic_impact')
        .select('*')
        .eq('campaign_id', donation.campaignId)
        .eq('country_code', donation.locationCountry)
        .maybeSingle();

      if (geoFetchError && geoFetchError.code !== 'PGRST116') {
        console.error('Error fetching geographic impact:', geoFetchError);
      }

      if (existingGeo) {
        const { error: geoUpdateError } = await supabase
          .from('campaign_geographic_impact')
          .update({
            total_donations: existingGeo.total_donations + donation.amount,
            donor_count: existingGeo.donor_count + 1
          })
          .eq('id', existingGeo.id);

        if (geoUpdateError) {
          console.error('Error updating geographic donations:', geoUpdateError);
        }
      } else {
        const { error: geoInsertError } = await supabase
          .from('campaign_geographic_impact')
          .insert({
            campaign_id: donation.campaignId,
            country_code: donation.locationCountry,
            country_name: donation.locationCountry,
            city: donation.locationCity,
            total_donations: donation.amount,
            donor_count: 1
          });

        if (geoInsertError) {
          console.error('Error creating geographic impact for donation:', geoInsertError);
        }
      }
    }

    // Generate new predictions after donation
    generatePredictions(donation.campaignId).catch(err => 
      console.error('Error generating predictions after donation:', err)
    );

    return { success: true, donation: donationRecord };
  } catch (error) {
    console.error('Error in trackDonation:', error);
    return { success: false, error };
  }
};

export const generatePredictions = async (campaignId: string) => {
  try {
    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError) {
      console.error('Error fetching campaign for predictions:', campaignError);
      return { success: false, error: campaignError };
    }

    // Fetch donations for trend analysis
    const { data: donations, error: donationsError } = await supabase
      .from('campaign_donations')
      .select('amount, created_at')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true });

    if (donationsError) {
      console.error('Error fetching donations for predictions:', donationsError);
      return { success: false, error: donationsError };
    }

    // Simple prediction logic (in a real app, this would be more sophisticated)
    let goalCompletionProbability = 0.5; // Default 50%
    let dailyDonationRate = 0;
    let viralPotential = 0.2; // Default 20%

    if (campaign.goal_amount && campaign.current_amount) {
      // Calculate goal completion probability
      const percentComplete = campaign.current_amount / campaign.goal_amount;
      const daysLeft = campaign.end_date 
        ? Math.max(1, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
        : 30;
      
      const campaignAge = Math.ceil((new Date().getTime() - new Date(campaign.created_at).getTime()) / (1000 * 3600 * 24));
      
      if (donations.length > 0 && campaignAge > 0) {
        // Calculate average daily donation amount
        const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
        dailyDonationRate = totalDonations / campaignAge;
        
        // Project final amount based on current rate
        const projectedAdditional = dailyDonationRate * daysLeft;
        const projectedFinal = campaign.current_amount + projectedAdditional;
        
        goalCompletionProbability = Math.min(0.99, projectedFinal / campaign.goal_amount);
      } else {
        // If no donations yet, base on percent complete
        goalCompletionProbability = Math.min(0.90, percentComplete * 2);
      }

      // Calculate viral potential based on share/view ratio
      if (campaign.total_views > 0) {
        viralPotential = Math.min(0.95, (campaign.total_shares || 0) / campaign.total_views * 10);
      }
    }

    // Store goal completion prediction
    const { error: goalPredictionError } = await supabase
      .from('campaign_predictions')
      .insert({
        campaign_id: campaignId,
        prediction_type: 'goal_completion',
        predicted_value: goalCompletionProbability,
        confidence_score: 0.8,
        prediction_date: new Date().toISOString().split('T')[0],
        model_version: '1.0'
      });

    if (goalPredictionError) {
      console.error('Error storing goal prediction:', goalPredictionError);
    }

    // Store daily donation prediction
    const { error: dailyPredictionError } = await supabase
      .from('campaign_predictions')
      .insert({
        campaign_id: campaignId,
        prediction_type: 'daily_donations',
        predicted_value: dailyDonationRate,
        confidence_score: 0.75,
        prediction_date: new Date().toISOString().split('T')[0],
        model_version: '1.0'
      });

    if (dailyPredictionError) {
      console.error('Error storing daily donation prediction:', dailyPredictionError);
    }

    // Store viral potential prediction
    const { error: viralPredictionError } = await supabase
      .from('campaign_predictions')
      .insert({
        campaign_id: campaignId,
        prediction_type: 'viral_potential',
        predicted_value: viralPotential,
        confidence_score: 0.7,
        prediction_date: new Date().toISOString().split('T')[0],
        model_version: '1.0'
      });

    if (viralPredictionError) {
      console.error('Error storing viral potential prediction:', viralPredictionError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error generating predictions:', error);
    return { success: false, error };
  }
};

export const useAnalyticsTracking = () => {
  const { toast } = useToast();

  const trackView = async (campaignId: string, options: Partial<AnalyticsTrackingOptions> = {}) => {
    try {
      // Detect device type
      const deviceType = detectDeviceType();
      
      const result = await trackCampaignView({
        campaignId,
        deviceType,
        ...options
      });
      
      if (!result.success) {
        console.error('Failed to track campaign view');
      }
      
      return result.success;
    } catch (error) {
      console.error('Error in trackView:', error);
      return false;
    }
  };

  const trackShare = async (campaignId: string, platform: string, options: Partial<AnalyticsTrackingOptions> = {}) => {
    try {
      const deviceType = detectDeviceType();
      
      const result = await trackCampaignShare({
        campaignId,
        platform,
        deviceType,
        ...options
      });

      if (result.success) {
        toast({
          title: "Shared Successfully",
          description: `Your campaign has been shared on ${platform}`,
        });
      } else {
        console.error('Failed to track share');
        toast({
          title: "Share Tracking Failed",
          description: "We couldn't record your share activity",
          variant: "destructive"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error in trackShare:', error);
      toast({
        title: "Share Error",
        description: "An error occurred while sharing",
        variant: "destructive"
      });
      return false;
    }
  };

  const recordDonation = async (
    campaignId: string, 
    amount: number, 
    options: Partial<{
      userId: string;
      currency: string;
      donationType: 'one_time' | 'recurring' | 'anonymous';
      source: string;
      isAnonymous: boolean;
      message: string;
    }> = {}
  ) => {
    try {
      const deviceType = detectDeviceType();
      
      const result = await trackDonation({
        campaignId,
        amount,
        deviceType,
        ...options
      });

      if (result.success) {
        toast({
          title: "Thank You for Your Donation!",
          description: `Your donation of $${amount} has been successfully processed.`,
        });
      } else {
        console.error('Failed to record donation');
        toast({
          title: "Donation Recording Failed",
          description: "We couldn't record your donation. Please contact support.",
          variant: "destructive"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error in recordDonation:', error);
      toast({
        title: "Donation Error",
        description: "An error occurred while processing your donation",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    trackView,
    trackShare,
    recordDonation
  };
};

// Helper function to detect device type
const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  
  return 'desktop';
};
