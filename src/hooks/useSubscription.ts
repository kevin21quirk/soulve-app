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
  const [isFoundingMember, setIsFoundingMember] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(null);
        setIsFoundingMember(false);
        return;
      }

      // Check founding member status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_founding_member')
        .eq('id', user.id)
        .single();

      setIsFoundingMember(profile?.is_founding_member || false);

      // Get subscription if not founding member
      const sub = await YapilyService.getUserSubscription(user.id);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateCampaign = (currentCount: number): boolean => {
    if (isFoundingMember) return true; // Unlimited for founding members
    if (!subscription) return currentCount < 3; // Free tier
    return currentCount < subscription.plan.max_campaigns;
  };

  const hasWhiteLabel = (): boolean => {
    if (isFoundingMember) return true; // Full access for founding members
    return subscription?.plan.white_label_enabled || false;
  };

  const getPlanName = (): string => {
    if (isFoundingMember) return 'Founding Member';
    return subscription?.plan.name || 'Free';
  };

  const isActive = (): boolean => {
    if (isFoundingMember) return true; // Always active for founding members
    return subscription?.status === 'active';
  };

  const getRemainingCampaigns = (currentCount: number): number => {
    if (isFoundingMember) return 999; // "Unlimited"
    if (!subscription) return Math.max(0, 3 - currentCount);
    return Math.max(0, subscription.plan.max_campaigns - currentCount);
  };

  const getMaxTeamMembers = (): number => {
    if (isFoundingMember) return 999; // "Unlimited"
    if (!subscription) return 5; // Free tier
    return subscription.plan.max_team_members;
  };

  return {
    subscription,
    loading,
    isFoundingMember,
    planName: getPlanName(),
    canCreateCampaign,
    hasWhiteLabel,
    isActive,
    getRemainingCampaigns,
    getMaxTeamMembers,
    refresh: loadSubscription
  };
};
