import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from './usePushNotifications';
import { useNotificationSound } from './useNotificationSound';
import { useNotificationPreferences } from './useNotificationPreferences';
import { useToast } from '@/hooks/use-toast';
import { UnifiedNotification } from '@/types/notifications';

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { showNotification } = usePushNotifications();
  const { playNotificationSound } = useNotificationSound();
  const { preferences } = useNotificationPreferences();
  const { toast } = useToast();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    const unified = (data || []).map((n: any) => ({
      ...n,
      isRead: n.is_read,
      timestamp: n.created_at,
    }));

    setNotifications(unified);
    setUnreadCount(unified.filter((n) => !n.isRead).length);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as any;
          const unified: UnifiedNotification = {
            ...newNotification,
            isRead: newNotification.is_read,
            timestamp: newNotification.created_at,
          };

          setNotifications((prev) => [unified, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Play sound if enabled
          if (preferences.sound_enabled) {
            playNotificationSound(
              newNotification.priority === 'urgent' ? 'urgent' : 'default'
            );
          }

          // Show push notification if enabled
          if (preferences.push_enabled) {
            showNotification(newNotification.title, {
              body: newNotification.message,
              tag: newNotification.id,
              requireInteraction: newNotification.priority === 'urgent',
            });
          }

          // Show toast
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updated.id
                ? { ...n, ...updated, isRead: updated.is_read }
                : n
            )
          );

          if (updated.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const deleted = payload.old as any;
          setNotifications((prev) => prev.filter((n) => n.id !== deleted.id));
          if (!deleted.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, preferences, showNotification, playNotificationSound, toast]);

  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all as read:', error);
    }
  }, [user]);

  const deleteNotification = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const filterNotifications = useCallback(
    (type: string) => {
      if (type === 'all') return notifications;
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
    refetch: fetchNotifications,
  };
};
