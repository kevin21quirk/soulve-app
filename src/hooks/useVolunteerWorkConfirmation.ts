import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VolunteerWorkConfirmationService, VolunteerWorkActivity } from '@/services/volunteerWorkConfirmationService';

export const useVolunteerWorkConfirmation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pendingConfirmations, setPendingConfirmations] = useState<VolunteerWorkActivity[]>([]);
  const [mySubmissions, setMySubmissions] = useState<VolunteerWorkActivity[]>([]);

  const loadConfirmations = async () => {
    if (!user?.id) return;

    try {
      const [pending, mine] = await Promise.all([
        VolunteerWorkConfirmationService.getPendingConfirmations(user.id),
        VolunteerWorkConfirmationService.getMySubmissions(user.id)
      ]);

      setPendingConfirmations(pending);
      setMySubmissions(mine);
    } catch (error) {
      console.error('Error loading confirmations:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadConfirmations();
    }
  }, [user?.id]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('volunteer_work_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'volunteer_work_notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New volunteer work notification:', payload);
          loadConfirmations();
          
          const notification = payload.new as any;
          if (notification.notification_type === 'confirmation_request') {
            toast({
              title: "New Volunteer Work Confirmation 📋",
              description: "Someone has logged volunteer work that needs your confirmation.",
            });
          } else if (notification.notification_type === 'confirmed') {
            toast({
              title: "Volunteer Work Confirmed! ✅",
              description: "Your volunteer contribution has been verified and points awarded.",
            });
          } else if (notification.notification_type === 'rejected') {
            toast({
              title: "Confirmation Declined",
              description: notification.metadata?.rejection_reason || "Your submission was not approved.",
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const confirmWork = async (activityId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to confirm volunteer work.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      await VolunteerWorkConfirmationService.confirmVolunteerWork(activityId);

      toast({
        title: "Volunteer Work Confirmed! ⭐",
        description: "Points have been awarded to the volunteer.",
      });

      await loadConfirmations();
      return true;
    } catch (error) {
      console.error('Error confirming volunteer work:', error);
      toast({
        title: "Error",
        description: "Failed to confirm volunteer work. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectWork = async (activityId: string, reason: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to reject volunteer work.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      await VolunteerWorkConfirmationService.rejectVolunteerWork(activityId, reason);

      toast({
        title: "Submission Rejected",
        description: "The volunteer has been notified.",
      });

      await loadConfirmations();
      return true;
    } catch (error) {
      console.error('Error rejecting volunteer work:', error);
      toast({
        title: "Error",
        description: "Failed to reject volunteer work. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pendingConfirmations,
    mySubmissions,
    confirmWork,
    rejectWork,
    loadConfirmations
  };
};
