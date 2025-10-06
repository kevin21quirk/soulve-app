import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationCounts {
  messages: number;
  feedback: number;
  total: number;
}

/**
 * Hook to track unread notification counts across different types
 * Returns counts for messages, feedback, and total
 */
export const useNotificationCounts = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    feedback: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setCounts({ messages: 0, feedback: 0, total: 0 });
      setLoading(false);
      return;
    }

    loadCounts();

    // Set up real-time subscriptions
    const messagesChannel = supabase
      .channel('notification-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    const feedbackChannel = supabase
      .channel('notification-feedback')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_feedback',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(feedbackChannel);
    };
  }, [user?.id]);

  const loadCounts = async () => {
    if (!user?.id) return;

    try {
      // Get unread messages count - fetch actual messages to debug
      const { data: unreadMessages, count: messagesCount, error: messagesError } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at, is_read', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (messagesError) {
        console.error('Error loading message counts:', messagesError);
      } else {
        console.log('Unread messages:', unreadMessages);
        console.log('Unread count:', messagesCount);
      }

      // Get unread feedback count (for admins only)
      let feedbackCount = 0;
      
      // Check if user is admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        user_uuid: user.id,
      });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }

      if (isAdminData) {
        const { count, error: feedbackError } = await supabase
          .from('platform_feedback')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        if (feedbackError) {
          console.error('Error loading feedback counts:', feedbackError);
        } else {
          feedbackCount = count || 0;
          console.log('Unread feedback count:', feedbackCount);
        }
      }

      const newCounts = {
        messages: messagesCount || 0,
        feedback: feedbackCount,
        total: (messagesCount || 0) + feedbackCount,
      };

      console.log('Setting notification counts:', newCounts);
      setCounts(newCounts);
    } catch (error) {
      console.error('Error loading notification counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      loadCounts();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    counts,
    loading,
    refreshCounts: loadCounts,
    markMessagesAsRead,
  };
};
