import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const useUserActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (fetchError) throw fetchError;

        const transformedActivities: UserActivity[] = (data || []).map(activity => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.title,
          description: activity.description || undefined,
          timestamp: activity.created_at,
          metadata: (activity.metadata as Record<string, any>) || undefined,
        }));

        setActivities(transformedActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Set up real-time subscription
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('user-activities')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_activities',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newActivity: UserActivity = {
              id: payload.new.id,
              type: payload.new.activity_type,
              title: payload.new.title,
              description: payload.new.description || undefined,
              timestamp: payload.new.created_at,
              metadata: (payload.new.metadata as Record<string, any>) || undefined,
            };
            setActivities(prev => [newActivity, ...prev].slice(0, 20));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);

  return { activities, loading, error };
};