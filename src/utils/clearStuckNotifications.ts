import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to manually refresh notification counts
 * Call this when you suspect the count is stuck
 */
export const clearStuckNotifications = async (userId: string) => {
  try {
    // Force re-query to get accurate count
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error checking notifications:', error);
      return null;
    }

    console.log('Actual unread count from database:', count);
    return count;
  } catch (error) {
    console.error('Error in clearStuckNotifications:', error);
    return null;
  }
};

/**
 * Force mark all messages as read for a user
 */
export const markAllMessagesAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all as read:', error);
      return false;
    }

    console.log('All messages marked as read');
    return true;
  } catch (error) {
    console.error('Error in markAllMessagesAsRead:', error);
    return false;
  }
};
