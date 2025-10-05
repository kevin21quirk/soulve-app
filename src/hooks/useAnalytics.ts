import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_name: string;
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
}

export const useAnalytics = () => {
  const trackEvent = async (eventName: string, eventData?: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const event: AnalyticsEvent = {
        event_name: eventName,
        event_data: eventData || {},
        user_id: user?.id,
        session_id: sessionStorage.getItem('session_id') || undefined,
      };

      // Store in local analytics table or send to external service
      console.log('Analytics Event:', event);
      
      // You can extend this to send to Google Analytics, Mixpanel, etc.
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackUserAction = (action: string, metadata?: Record<string, any>) => {
    trackEvent('user_action', { action, ...metadata });
  };

  const trackCampaignView = (campaignId: string) => {
    trackEvent('campaign_view', { campaign_id: campaignId });
  };

  const trackDonation = (campaignId: string, amount: number) => {
    trackEvent('donation', { campaign_id: campaignId, amount });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackCampaignView,
    trackDonation,
  };
};
