
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CampaignAnalyticsData {
  analytics: {
    totalViews: number;
    uniqueViews: number;
    totalDonations: number;
    donationAmount: number;
    socialShares: number;
    commentCount: number;
    conversionRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };
  donations: Array<{
    id: string;
    amount: number;
    currency: string;
    donationType: string;
    source: string;
    deviceType: string;
    locationCountry: string;
    locationCity: string;
    paymentStatus: string;
    isAnonymous: boolean;
    createdAt: string;
  }>;
  engagement: Array<{
    actionType: string;
    count: number;
    trend: number;
  }>;
  socialMetrics: Array<{
    platform: string;
    shares: number;
    likes: number;
    comments: number;
    reach: number;
  }>;
  geographicImpact: Array<{
    countryCode: string;
    countryName: string;
    totalDonations: number;
    donorCount: number;
    totalViews: number;
  }>;
  predictions: Array<{
    type: string;
    value: number;
    confidence: number;
    date: string;
  }>;
  performanceScore: number;
}

export const useCampaignAnalytics = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: async (): Promise<CampaignAnalyticsData> => {
      console.log('Fetching analytics for campaign:', campaignId);

      try {
        // Fetch analytics data
        const { data: analytics, error: analyticsError } = await supabase
          .from('campaign_analytics')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (analyticsError && analyticsError.code !== 'PGRST116') {
          console.error('Analytics error:', analyticsError);
        }

        // Fetch donations data
        const { data: donations, error: donationsError } = await supabase
          .from('campaign_donations')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });

        if (donationsError) {
          console.error('Donations error:', donationsError);
        }

        // Fetch engagement data
        const { data: engagement, error: engagementError } = await supabase
          .from('campaign_engagement')
          .select('action_type')
          .eq('campaign_id', campaignId);

        if (engagementError) {
          console.error('Engagement error:', engagementError);
        }

        // Fetch social metrics
        const { data: socialMetrics, error: socialError } = await supabase
          .from('campaign_social_metrics')
          .select('*')
          .eq('campaign_id', campaignId);

        if (socialError) {
          console.error('Social metrics error:', socialError);
        }

        // Fetch geographic impact
        const { data: geographic, error: geoError } = await supabase
          .from('campaign_geographic_impact')
          .select('*')
          .eq('campaign_id', campaignId);

        if (geoError) {
          console.error('Geographic error:', geoError);
        }

        // Fetch predictions
        const { data: predictions, error: predictionsError } = await supabase
          .from('campaign_predictions')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });

        if (predictionsError) {
          console.error('Predictions error:', predictionsError);
        }

        // Calculate performance score
        const { data: performanceScore, error: scoreError } = await supabase
          .rpc('calculate_campaign_performance_score', { campaign_uuid: campaignId });

        if (scoreError) {
          console.error('Performance score error:', scoreError);
        }

        // Process engagement data
        const engagementSummary = engagement?.reduce((acc, item) => {
          const existing = acc.find(e => e.actionType === item.action_type);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ actionType: item.action_type, count: 1, trend: 0 });
          }
          return acc;
        }, [] as Array<{ actionType: string; count: number; trend: number }>) || [];

        // Process social metrics by platform
        const socialSummary = socialMetrics?.reduce((acc, metric) => {
          const platform = acc.find(p => p.platform === metric.platform);
          if (platform) {
            if (metric.metric_type === 'share') platform.shares += metric.value || 0;
            if (metric.metric_type === 'like') platform.likes += metric.value || 0;
            if (metric.metric_type === 'comment') platform.comments += metric.value || 0;
            if (metric.metric_type === 'reach') platform.reach += metric.value || 0;
          } else {
            acc.push({
              platform: metric.platform,
              shares: metric.metric_type === 'share' ? metric.value || 0 : 0,
              likes: metric.metric_type === 'like' ? metric.value || 0 : 0,
              comments: metric.metric_type === 'comment' ? metric.value || 0 : 0,
              reach: metric.metric_type === 'reach' ? metric.value || 0 : 0,
            });
          }
          return acc;
        }, [] as Array<{ platform: string; shares: number; likes: number; comments: number; reach: number }>) || [];

        return {
          analytics: {
            totalViews: analytics?.total_views || 0,
            uniqueViews: analytics?.unique_views || 0,
            totalDonations: analytics?.total_donations || 0,
            donationAmount: analytics?.donation_amount || 0,
            socialShares: analytics?.social_shares || 0,
            commentCount: analytics?.comment_count || 0,
            conversionRate: analytics?.conversion_rate || 0,
            bounceRate: analytics?.bounce_rate || 0,
            avgTimeOnPage: analytics?.avg_time_on_page || 0,
          },
          donations: donations?.map(d => ({
            id: d.id,
            amount: d.amount,
            currency: d.currency || 'USD',
            donationType: d.donation_type || 'one_time',
            source: d.source || 'direct',
            deviceType: d.device_type || 'unknown',
            locationCountry: d.location_country || 'Unknown',
            locationCity: d.location_city || 'Unknown',
            paymentStatus: d.payment_status || 'pending',
            isAnonymous: d.is_anonymous || false,
            createdAt: d.created_at,
          })) || [],
          engagement: engagementSummary,
          socialMetrics: socialSummary,
          geographicImpact: geographic?.map(g => ({
            countryCode: g.country_code,
            countryName: g.country_name,
            totalDonations: g.total_donations || 0,
            donorCount: g.donor_count || 0,
            totalViews: g.total_views || 0,
          })) || [],
          predictions: predictions?.map(p => ({
            type: p.prediction_type,
            value: p.predicted_value || 0,
            confidence: p.confidence_score || 0,
            date: p.prediction_date,
          })) || [],
          performanceScore: performanceScore || 0,
        };
      } catch (error) {
        console.error('Error fetching campaign analytics:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
};
