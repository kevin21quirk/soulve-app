import { useState, useEffect } from 'react';
import { YapilyService } from '@/services/yapilyService';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  features: any;
  max_campaigns: number;
  max_team_members: number;
  white_label_enabled: boolean;
}

interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(null);
        return;
      }

      const sub = await YapilyService.getUserSubscription(user.id);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateCampaign = (currentCount: number): boolean => {
    if (!subscription) return currentCount < 3; // Free tier
    return currentCount < subscription.plan.max_campaigns;
  };

  const hasWhiteLabel = (): boolean => {
    return subscription?.plan.white_label_enabled || false;
  };

  const getPlanName = (): string => {
    return subscription?.plan.name || 'Free';
  };

  const isActive = (): boolean => {
    return subscription?.status === 'active';
  };

  const getRemainingCampaigns = (currentCount: number): number => {
    if (!subscription) return Math.max(0, 3 - currentCount);
    return Math.max(0, subscription.plan.max_campaigns - currentCount);
  };

  return {
    subscription,
    loading,
    planName: getPlanName(),
    canCreateCampaign,
    hasWhiteLabel,
    isActive,
    getRemainingCampaigns,
    refresh: loadSubscription
  };
};
