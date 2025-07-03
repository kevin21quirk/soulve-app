
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { optimizedCache } from '@/services/optimizedCacheService';

interface OptimizedNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export const useOptimizedNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<OptimizedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Optimized fetch function with caching
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const cacheKey = `notifications-${user.id}`;
    
    try {
      const data = await optimizedCache.getOrSet(
        cacheKey,
        async () => {
          const { data, error } = await supabase
            .from('notifications')
            .select('id, type, title, message, is_read, created_at, metadata')
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

          if (error) throw error;
          return data || [];
        },
        2 * 60 * 1000 // 2 minutes cache
      );

      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);

  // Optimized mark as read function
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', user.id);

      if (error) throw error;

      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

      // Invalidate cache
      optimizedCache.delete(`notifications-${user.id}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    };

    loadNotifications();
  }, [fetchNotifications]);

  // Real-time subscription with debouncing
  useEffect(() => {
    if (!user) return;

    let debounceTimer: NodeJS.Timeout;

    const channel = supabase
      .channel('optimized-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Debounce updates to prevent excessive re-renders
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            optimizedCache.delete(`notifications-${user.id}`);
            fetchNotifications();
          }, 300);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Memoize return object
  return useMemo(() => ({
    notifications,
    loading,
    unreadCount,
    markAsRead,
    refetch: fetchNotifications
  }), [notifications, loading, unreadCount, markAsRead, fetchNotifications]);
};
