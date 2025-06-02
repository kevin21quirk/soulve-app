
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedPointsService } from '@/services/enhancedPointsService';
import { 
  EnhancedImpactMetrics, 
  EnhancedImpactActivity, 
  TrustDomain, 
  RedFlag,
  ENHANCED_POINT_VALUES 
} from '@/types/enhancedGamification';

export const useEnhancedPoints = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<EnhancedImpactMetrics | null>(null);
  const [trustDomains, setTrustDomains] = useState<TrustDomain[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [recentActivities, setRecentActivities] = useState<EnhancedImpactActivity[]>([]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [userMetrics, domains, flags] = await Promise.all([
        EnhancedPointsService.getUserMetrics(user.id),
        EnhancedPointsService.getUserTrustDomains(user.id),
        EnhancedPointsService.getUserRedFlags(user.id)
      ]);

      setMetrics(userMetrics);
      setTrustDomains(domains);
      setRedFlags(flags);

      // Load recent activities
      const { data: activities } = await supabase
        .from('impact_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activities) {
        setRecentActivities(activities as EnhancedImpactActivity[]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your points data. Please refresh.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to impact activities changes
    const activitiesChannel = supabase
      .channel('impact-activities-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'impact_activities',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newActivity = payload.new as EnhancedImpactActivity;
          setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
          
          // Show real-time notification
          toast({
            title: `+${newActivity.points_earned} Points Earned! 🎉`,
            description: newActivity.description,
          });
        }
      )
      .subscribe();

    // Subscribe to metrics changes
    const metricsChannel = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_metrics',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Reload metrics when they change
          loadUserData();
        }
      )
      .subscribe();

    // Subscribe to red flags changes
    const redFlagsChannel = supabase
      .channel('red-flags-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'red_flags',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newFlag = payload.new as RedFlag;
            setRedFlags(prev => [newFlag, ...prev]);
            
            toast({
              title: "Security Notice",
              description: `Your account has been flagged: ${newFlag.description}`,
              variant: "destructive"
            });
          } else {
            loadUserData(); // Reload for updates/deletes
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(redFlagsChannel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const awardPoints = async (
    activityType: string,
    basePoints: number,
    description: string,
    metadata: Record<string, any> = {},
    effortLevel: number = 3,
    requiresEvidence: boolean = false
  ) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to earn points.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const activity = await EnhancedPointsService.awardPoints(
        user.id,
        activityType,
        basePoints,
        description,
        metadata,
        effortLevel,
        requiresEvidence
      );

      // Don't show toast here as real-time subscription will handle it
      return activity;
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: "Failed to award points. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const awardHelpPoints = async (
    postId: string,
    rating: number,
    effortLevel: number = 3,
    isEmergency: boolean = false
  ) => {
    if (!user?.id) return null;

    try {
      await EnhancedPointsService.awardHelpCompletionPoints(
        user.id,
        postId,
        rating,
        effortLevel,
        isEmergency
      );

      await loadUserData();
    } catch (error) {
      console.error('Error awarding help points:', error);
      toast({
        title: "Error",
        description: "Failed to award help points.",
        variant: "destructive"
      });
    }
  };

  const awardDonationPoints = async (
    amount: number,
    isRecurring: boolean = false,
    isMatching: boolean = false
  ) => {
    if (!user?.id) return null;

    try {
      await EnhancedPointsService.awardDonationPoints(
        user.id,
        amount,
        isRecurring,
        isMatching
      );

      let pointsPerPound = ENHANCED_POINT_VALUES.donation;
      if (isMatching) pointsPerPound = ENHANCED_POINT_VALUES.matching_donation;
      else if (isRecurring) pointsPerPound = ENHANCED_POINT_VALUES.recurring_donation;

      const totalPoints = Math.round(amount * pointsPerPound);

      toast({
        title: `Donation Recorded! +${totalPoints} Points! 💝`,
        description: `£${amount} ${isRecurring ? '(recurring)' : ''}${isMatching ? '(matching)' : ''}`,
      });

      await loadUserData();
    } catch (error) {
      console.error('Error awarding donation points:', error);
      toast({
        title: "Error",
        description: "Failed to record donation points.",
        variant: "destructive"
      });
    }
  };

  const submitEvidence = async (
    activityId: string,
    evidenceType: string,
    fileUrl?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return null;

    try {
      const evidence = await EnhancedPointsService.submitEvidence(
        user.id,
        activityId,
        evidenceType,
        fileUrl,
        metadata
      );

      toast({
        title: "Evidence Submitted! 📸",
        description: "Your evidence is being reviewed.",
      });

      return evidence;
    } catch (error) {
      console.error('Error submitting evidence:', error);
      toast({
        title: "Error",
        description: "Failed to submit evidence.",
        variant: "destructive"
      });
      return null;
    }
  };

  const getTrustTier = () => {
    if (!metrics) return { name: 'Basic Member', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    return EnhancedPointsService.getTrustTier(metrics.impact_score);
  };

  const getTrustScoreBreakdown = () => {
    if (!metrics) return null;
    
    const lifetimeComponent = metrics.impact_score * 0.6;
    const ratingComponent = metrics.average_rating * 10 * 0.3;
    const flagsPenalty = metrics.red_flag_count * 10 * 0.1;
    
    return {
      total: metrics.trust_score,
      components: {
        lifetime_points: Math.round(lifetimeComponent),
        average_rating: Math.round(ratingComponent),
        red_flags_penalty: Math.round(flagsPenalty)
      }
    };
  };

  return {
    loading,
    metrics,
    trustDomains,
    redFlags,
    recentActivities,
    awardPoints,
    awardHelpPoints,
    awardDonationPoints,
    submitEvidence,
    getTrustTier,
    getTrustScoreBreakdown,
    loadUserData
  };
};
