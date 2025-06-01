
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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

      // Show success notification
      const pointsEarned = activity.points_earned;
      const tierInfo = EnhancedPointsService.getTrustTier(
        (metrics?.impact_score || 0) + pointsEarned
      );

      toast({
        title: `+${pointsEarned} Points Earned! 🎉`,
        description: `${description} | ${tierInfo.name}`,
      });

      // Reload user data
      await loadUserData();
      
      return activity;
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: "Failed to award points. Please try again.",
        variant: "destructive"
      });
      return null;
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

      const basePoints = isEmergency ? ENHANCED_POINT_VALUES.emergency_help : ENHANCED_POINT_VALUES.help_completed;
      const multiplier = effortLevel === 5 ? 2.0 : effortLevel === 4 ? 1.4 : effortLevel === 2 ? 0.6 : effortLevel === 1 ? 0.4 : 1.0;
      const finalPoints = Math.round(basePoints * multiplier);

      toast({
        title: `Help Completed! +${finalPoints} Points! 🌟`,
        description: `${rating}/5 rating | ${isEmergency ? 'Emergency' : 'Standard'} help`,
      });

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
