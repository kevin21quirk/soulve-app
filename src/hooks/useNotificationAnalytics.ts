import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationAnalytics = () => {
  const trackEvent = async (
    notificationId: string,
    eventType: 'viewed' | 'clicked' | 'dismissed' | 'action_taken',
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('notification_analytics').insert({
        notification_id: notificationId,
        user_id: user.id,
        event_type: eventType,
        event_metadata: metadata
      });
    } catch (error) {
      console.error('Failed to track notification event:', error);
    }
  };

  const trackDelivery = async (
    notificationId: string,
    deliveryMethod: 'in_app' | 'push' | 'email',
    deviceInfo: Record<string, any> = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('notification_delivery_log').insert({
        notification_id: notificationId,
        user_id: user.id,
        delivery_method: deliveryMethod,
        device_info: deviceInfo,
        delivered_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track notification delivery:', error);
    }
  };

  const markOpened = async (notificationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notification_delivery_log')
        .update({ opened_at: new Date().toISOString() })
        .eq('notification_id', notificationId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Failed to mark notification as opened:', error);
    }
  };

  const markClicked = async (notificationId: string, actionTaken?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notification_delivery_log')
        .update({ 
          clicked_at: new Date().toISOString(),
          action_taken: actionTaken 
        })
        .eq('notification_id', notificationId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Failed to mark notification as clicked:', error);
    }
  };

  const getAnalytics = async (daysBack: number = 30) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('get_notification_analytics', {
        p_user_id: user.id,
        p_days_back: daysBack
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to get notification analytics:', error);
      return null;
    }
  };

  return {
    trackEvent,
    trackDelivery,
    markOpened,
    markClicked,
    getAnalytics
  };
};
