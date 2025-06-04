
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  sound_enabled: boolean;
  categories: {
    connection_requests: boolean;
    help_requests: boolean;
    messages: boolean;
    campaigns: boolean;
    system: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
}

const defaultPreferences: NotificationPreferences = {
  push_enabled: true,
  email_enabled: true,
  sound_enabled: true,
  categories: {
    connection_requests: true,
    help_requests: true,
    messages: true,
    campaigns: false,
    system: true,
  },
  quiet_hours: {
    enabled: false,
    start_time: "22:00",
    end_time: "08:00",
  },
};

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Map existing privacy settings to notification preferences
        setPreferences(prev => ({
          ...prev,
          push_enabled: data.show_online_status || true,
          email_enabled: true, // Default to true since we don't have this field yet
        }));
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    try {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      
      // For now, we'll store basic preferences in user_privacy_settings
      // In a real implementation, you'd want a dedicated notifications_preferences table
      await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          show_online_status: newPreferences.push_enabled ?? preferences.push_enabled,
        });

    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }, [user, preferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    updatePreferences,
  };
};
