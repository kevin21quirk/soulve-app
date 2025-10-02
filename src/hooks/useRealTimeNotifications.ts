
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotificationAnalytics } from './useNotificationAnalytics';
import { useNotificationGrouping } from './useNotificationGrouping';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
  sender_id?: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  action_url?: string;
  action_type?: 'accept' | 'decline' | 'reply' | 'view' | 'like' | 'share';
  group_key?: string;
  delivery_status?: 'pending' | 'delivered' | 'read' | 'failed';
  read_at?: string;
}

export const useRealTimeNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trackEvent, trackDelivery } = useNotificationAnalytics();
  const { groupedNotifications } = useNotificationGrouping(notifications);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedNotifications = (data || []).map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        is_read: notification.is_read,
        created_at: notification.created_at,
        metadata: notification.metadata,
        sender_id: notification.sender_id,
        timestamp: notification.created_at,
        isRead: notification.is_read,
        priority: (notification.priority as 'urgent' | 'high' | 'normal' | 'low') || 'normal',
        action_url: notification.action_url || undefined,
        action_type: (notification.action_type as 'accept' | 'decline' | 'reply' | 'view' | 'like' | 'share') || undefined,
        group_key: notification.group_key || undefined,
        delivery_status: (notification.delivery_status as 'pending' | 'delivered' | 'read' | 'failed') || 'pending',
        read_at: notification.read_at || undefined
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const now = new Date().toISOString();
      await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: now,
          delivery_status: 'read'
        })
        .eq('id', notificationId);

      // Track analytics
      await trackEvent(notificationId, 'viewed');

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { 
            ...n, 
            is_read: true, 
            isRead: true,
            read_at: now,
            delivery_status: 'read'
          } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [trackEvent]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'created_at' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      isRead: notification.is_read
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const filterNotifications = useCallback((type: string) => {
    if (type === "all") return notifications;
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          addNotification({
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            is_read: newNotification.is_read,
            metadata: newNotification.metadata,
            sender_id: newNotification.sender_id
          });

          // Show toast for new notifications
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, addNotification, toast]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    groupedNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    filterNotifications,
    refreshNotifications: fetchNotifications
  };
};
