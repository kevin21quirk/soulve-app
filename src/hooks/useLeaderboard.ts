import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry, TrustLevel } from '@/types/gamification';

const getTrustLevelFromScore = (score: number): TrustLevel => {
  if (score >= 90) return 'impact_champion';
  if (score >= 75) return 'community_leader';
  if (score >= 60) return 'trusted_helper';
  if (score >= 40) return 'verified_helper';
  return 'new_user';
};

export const useLeaderboard = (timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time', limit: number = 50) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Determine date filter based on timeframe
      let dateFilter: string | null = null;
      if (timeframe === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = weekAgo.toISOString();
      } else if (timeframe === 'monthly') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = monthAgo.toISOString();
      }

      // Fetch top users by impact_score
      const { data: topUsers } = await supabase
        .from('impact_metrics')
        .select(`
          user_id,
          impact_score,
          trust_score,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('impact_score', { ascending: false })
        .limit(limit);

      if (!topUsers) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Calculate weekly/monthly points if needed
      let periodPoints: Record<string, number> = {};
      if (dateFilter) {
        const { data: recentActivities } = await supabase
          .from('impact_activities')
          .select('user_id, points_earned')
          .gte('created_at', dateFilter)
          .eq('verified', true)
          .eq('points_state', 'active');

        recentActivities?.forEach(activity => {
          periodPoints[activity.user_id] = (periodPoints[activity.user_id] || 0) + (activity.points_earned || 0);
        });
      }

      // Build leaderboard entries
      const entries: LeaderboardEntry[] = topUsers.map((userData, index) => {
        const profile = userData.profiles as any;
        const userName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
          : 'Anonymous';

        return {
          userId: userData.user_id,
          userName,
          avatar: profile?.avatar_url || '',
          totalPoints: userData.impact_score || 0,
          trustLevel: getTrustLevelFromScore(userData.trust_score || 50),
          rank: index + 1,
          weeklyPoints: timeframe === 'weekly' ? (periodPoints[userData.user_id] || 0) : 0,
          monthlyPoints: timeframe === 'monthly' ? (periodPoints[userData.user_id] || 0) : 0
        };
      });

      setLeaderboard(entries);

      // Find current user's rank
      if (user?.id) {
        const userEntry = entries.find(entry => entry.userId === user.id);
        if (userEntry) {
          setUserRank(userEntry.rank);
        } else {
          // User not in top N, need to calculate their actual rank
          const { count } = await supabase
            .from('impact_metrics')
            .select('*', { count: 'exact', head: true })
            .gt('impact_score', entries[entries.length - 1]?.totalPoints || 0);
          
          setUserRank((count || 0) + 1);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Real-time subscription for rank changes
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_metrics'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, timeframe, limit]);

  return {
    leaderboard,
    userRank,
    loading,
    refetch: fetchLeaderboard
  };
};
