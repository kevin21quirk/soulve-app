import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotificationBulkOperations = () => {
  const { toast } = useToast();

  const markAllAsRead = async () => {
    try {
      const { data, error } = await supabase.rpc('bulk_mark_notifications_read', {
        mark_all: true,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Marked ${data} notifications as read`,
      });

      return data;
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
      return 0;
    }
  };

  const markSelectedAsRead = async (notificationIds: string[]) => {
    try {
      const { data, error } = await supabase.rpc('bulk_mark_notifications_read', {
        notification_ids: notificationIds,
        mark_all: false,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Marked ${data} notifications as read`,
      });

      return data;
    } catch (error: any) {
      console.error('Error marking selected as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
      return 0;
    }
  };

  const deleteSelected = async (notificationIds: string[]) => {
    try {
      const { data, error } = await supabase.rpc('bulk_delete_notifications', {
        notification_ids: notificationIds,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Deleted ${data} notifications`,
      });

      return data;
    } catch (error: any) {
      console.error('Error deleting notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notifications',
        variant: 'destructive',
      });
      return 0;
    }
  };

  const deleteOlderThan = async (days: number) => {
    try {
      const { data, error } = await supabase.rpc('bulk_delete_notifications', {
        notification_ids: [],
        older_than_days: days,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Deleted ${data} old notifications`,
      });

      return data;
    } catch (error: any) {
      console.error('Error deleting old notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete old notifications',
        variant: 'destructive',
      });
      return 0;
    }
  };

  return {
    markAllAsRead,
    markSelectedAsRead,
    deleteSelected,
    deleteOlderThan,
  };
};
