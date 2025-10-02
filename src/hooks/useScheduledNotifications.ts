import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScheduledNotification {
  id: string;
  template_id?: string;
  recipient_id: string;
  sender_id?: string;
  scheduled_for: string;
  title: string;
  message: string;
  type: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  action_url?: string;
  action_type?: string;
  metadata: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sent_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useScheduledNotifications = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchScheduledNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setScheduledNotifications((data || []) as ScheduledNotification[]);
    } catch (error: any) {
      console.error('Error fetching scheduled notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load scheduled notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (notification: Omit<ScheduledNotification, 'id' | 'created_at' | 'updated_at' | 'status' | 'sent_at' | 'error_message'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('scheduled_notifications')
        .insert({
          ...notification,
          sender_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notification scheduled successfully',
      });

      await fetchScheduledNotifications();
      return data;
    } catch (error: any) {
      console.error('Error scheduling notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule notification',
        variant: 'destructive',
      });
      return null;
    }
  };

  const cancelScheduledNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Scheduled notification cancelled',
      });

      await fetchScheduledNotifications();
    } catch (error: any) {
      console.error('Error cancelling notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel notification',
        variant: 'destructive',
      });
    }
  };

  const deleteScheduledNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Scheduled notification deleted',
      });

      await fetchScheduledNotifications();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchScheduledNotifications();

    // Subscribe to changes
    const channel = supabase
      .channel('scheduled_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_notifications',
        },
        () => {
          fetchScheduledNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    scheduledNotifications,
    loading,
    fetchScheduledNotifications,
    scheduleNotification,
    cancelScheduledNotification,
    deleteScheduledNotification,
  };
};
