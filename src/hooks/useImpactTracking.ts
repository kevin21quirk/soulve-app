
import { useAuth } from '@/contexts/AuthContext';
import { ImpactAnalyticsService } from '@/services/impactAnalyticsService';
import { useToast } from '@/hooks/use-toast';

export const useImpactTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const trackHelpProvided = async (helpTitle: string, metadata: Record<string, any> = {}) => {
    if (!user?.id) return;

    try {
      await ImpactAnalyticsService.awardImpactPoints(
        user.id,
        'help_provided',
        15,
        `Helped someone with: ${helpTitle}`,
        metadata
      );

      toast({
        title: "Impact Points Earned! 🌟",
        description: `+15 points for helping with "${helpTitle}"`,
      });
    } catch (error) {
      console.error('Error tracking help provided:', error);
    }
  };

  const trackVolunteerWork = async (hours: number, description: string, organization?: string) => {
    if (!user?.id) return;

    try {
      await ImpactAnalyticsService.awardImpactPoints(
        user.id,
        'volunteer',
        hours * 3,
        description,
        { hours, organization }
      );

      toast({
        title: "Volunteer Impact Recorded! 🙌",
        description: `+${hours * 3} points for ${hours} hours of volunteer work`,
      });
    } catch (error) {
      console.error('Error tracking volunteer work:', error);
    }
  };

  const trackDonation = async (amount: number, cause: string, organization?: string) => {
    if (!user?.id) return;

    try {
      const points = Math.floor(amount * 0.1);
      await ImpactAnalyticsService.awardImpactPoints(
        user.id,
        'donation',
        points,
        `Donated $${amount} to ${cause}`,
        { amount, cause, organization }
      );

      toast({
        title: "Donation Impact Recorded! 💝",
        description: `+${points} points for your $${amount} donation`,
      });
    } catch (error) {
      console.error('Error tracking donation:', error);
    }
  };

  const trackConnection = async (connectionType: string, partnerName: string) => {
    if (!user?.id) return;

    try {
      await ImpactAnalyticsService.awardImpactPoints(
        user.id,
        'connection',
        2,
        `Connected with ${partnerName}`,
        { connectionType, partnerName }
      );

      toast({
        title: "Network Growing! 🤝",
        description: `+2 points for connecting with ${partnerName}`,
      });
    } catch (error) {
      console.error('Error tracking connection:', error);
    }
  };

  const trackCommunityEngagement = async (engagementType: string, description: string) => {
    if (!user?.id) return;

    try {
      const pointsMap: Record<string, number> = {
        'post_like': 1,
        'post_comment': 2,
        'post_share': 3,
        'group_join': 5,
        'event_attend': 8
      };

      const points = pointsMap[engagementType] || 1;

      await ImpactAnalyticsService.awardImpactPoints(
        user.id,
        'engagement',
        points,
        description,
        { engagementType }
      );
    } catch (error) {
      console.error('Error tracking community engagement:', error);
    }
  };

  const refreshImpactMetrics = async () => {
    if (!user?.id) return;

    try {
      await ImpactAnalyticsService.calculateUserMetrics(user.id);
    } catch (error) {
      console.error('Error refreshing impact metrics:', error);
    }
  };

  return {
    trackHelpProvided,
    trackVolunteerWork,
    trackDonation,
    trackConnection,
    trackCommunityEngagement,
    refreshImpactMetrics
  };
};
