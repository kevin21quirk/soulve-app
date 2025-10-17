import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  helpActivityData: Array<{
    week: string;
    helped: number;
    received: number;
  }>;
  engagementData: Array<{
    day: string;
    posts: number;
    likes: number;
    comments: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  impactMetrics: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  'help_provided': '#8884d8',
  'help_completed': '#82ca9d',
  'donation': '#ffc658',
  'volunteer': '#ff7c7c',
  'connection': '#8dd1e1',
  'default': '#999999'
};

export const useRealAnalyticsData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch help activity by week (last 6 weeks)
      const sixWeeksAgo = new Date();
      sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

      const { data: helpActivities } = await supabase
        .from('impact_activities')
        .select('created_at, activity_type, user_id')
        .eq('user_id', user.id)
        .gte('created_at', sixWeeksAgo.toISOString())
        .in('activity_type', ['help_provided', 'help_completed']);

      // Process help activity data by week
      const weeklyData: Record<number, { helped: number; received: number }> = {};
      helpActivities?.forEach(activity => {
        const weekNumber = Math.floor((new Date().getTime() - new Date(activity.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (!weeklyData[weekNumber]) {
          weeklyData[weekNumber] = { helped: 0, received: 0 };
        }
        if (activity.activity_type === 'help_provided' || activity.activity_type === 'help_completed') {
          weeklyData[weekNumber].helped++;
        }
      });

      const helpActivityData = Array.from({ length: 6 }, (_, i) => ({
        week: `Week ${6 - i}`,
        helped: weeklyData[i]?.helped || 0,
        received: weeklyData[i]?.received || 0
      }));

      // Fetch engagement data by day of week (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: posts } = await supabase
        .from('posts')
        .select('created_at')
        .eq('author_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: interactions } = await supabase
        .from('post_interactions')
        .select('created_at, interaction_type, post_id')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Process engagement by day
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyEngagement: Record<string, { posts: number; likes: number; comments: number }> = {};
      
      dayNames.forEach(day => {
        dailyEngagement[day] = { posts: 0, likes: 0, comments: 0 };
      });

      posts?.forEach(post => {
        const day = dayNames[new Date(post.created_at).getDay()];
        dailyEngagement[day].posts++;
      });

      interactions?.forEach(interaction => {
        const day = dayNames[new Date(interaction.created_at).getDay()];
        if (interaction.interaction_type === 'like') {
          dailyEngagement[day].likes++;
        } else if (interaction.interaction_type === 'comment') {
          dailyEngagement[day].comments++;
        }
      });

      const engagementData = dayNames.map(day => dailyEngagement[day] ? {
        day,
        ...dailyEngagement[day]
      } : { day, posts: 0, likes: 0, comments: 0 });

      // Fetch category distribution
      const { data: categoryActivities } = await supabase
        .from('impact_activities')
        .select('activity_type')
        .eq('user_id', user.id);

      const categoryCount: Record<string, number> = {};
      categoryActivities?.forEach(activity => {
        const category = activity.activity_type;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const categoryData = Object.entries(categoryCount)
        .map(([name, value]) => ({
          name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS.default
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Fetch impact metrics
      const { data: metrics } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Calculate previous week metrics for trend
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: helpCountThisWeek } = await supabase
        .from('impact_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('activity_type', ['help_provided', 'help_completed'])
        .gte('created_at', oneWeekAgo.toISOString());

      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const { count: helpCountLastWeek } = await supabase
        .from('impact_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('activity_type', ['help_provided', 'help_completed'])
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString());

      const helpChange = helpCountLastWeek && helpCountLastWeek > 0
        ? ((((helpCountThisWeek || 0) - helpCountLastWeek) / helpCountLastWeek) * 100).toFixed(0)
        : '0';

      const impactMetrics = [
        {
          title: "People Helped",
          value: String(metrics?.help_provided_count || 0),
          change: `${helpChange}%`,
          trend: (helpCountThisWeek || 0) >= (helpCountLastWeek || 0) ? "up" as const : "down" as const
        },
        {
          title: "Volunteer Hours",
          value: `${metrics?.volunteer_hours || 0}hrs`,
          change: "+0%",
          trend: "up" as const
        },
        {
          title: "Trust Score",
          value: `${metrics?.trust_score || 50}%`,
          change: "+0%",
          trend: "up" as const
        },
        {
          title: "Response Time",
          value: `${metrics?.response_time_hours?.toFixed(1) || '0'}h`,
          change: "0%",
          trend: "down" as const
        }
      ];

      setData({
        helpActivityData,
        engagementData,
        categoryData,
        impactMetrics
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();

    // Set up real-time subscriptions
    if (!user?.id) return;

    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_activities',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchAnalyticsData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `author_id=eq.${user.id}`
        },
        () => {
          fetchAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const refetch = () => {
    fetchAnalyticsData();
  };

  return {
    ...data,
    isLoading,
    error,
    refetch,
  };
};
