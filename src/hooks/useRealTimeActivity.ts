
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RealTimeActivity {
  id: string;
  type: 'like' | 'comment' | 'share' | 'help_request' | 'help_offered' | 'connection';
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  target_id?: string;
  location?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const useRealTimeActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<RealTimeActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          id,
          activity_type,
          description,
          metadata,
          created_at,
          user_id,
          profiles!inner(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformedActivities: RealTimeActivity[] = (data || []).map(activity => ({
        id: activity.id,
        type: activity.activity_type as any,
        user_id: activity.user_id,
        user_name: `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}`.trim(),
        user_avatar: activity.profiles.avatar_url || undefined,
        content: activity.description,
        timestamp: activity.created_at,
        metadata: activity.metadata
      }));

      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchActivities();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('activities-realtime')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activities'
        }, (payload) => {
          console.log('New activity:', payload);
          fetchActivities(); // Refresh activities
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchActivities]);

  return {
    activities,
    loading,
    refetch: fetchActivities
  };
};
