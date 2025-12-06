import { supabase } from '@/integrations/supabase/client';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  activityHistory: ActivityDay[];
  weeklyActivity: number;
  monthlyActivity: number;
}

export interface ActivityDay {
  date: string;
  hasActivity: boolean;
  activityCount: number;
  points: number;
}

export interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  reward: string;
  icon: string;
  achieved: boolean;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: "Getting Started", description: "3 days of activity", reward: "+10 bonus points", icon: "🔥", achieved: false },
  { days: 7, title: "Week Warrior", description: "7 consecutive days", reward: "+25 bonus points", icon: "⚡", achieved: false },
  { days: 14, title: "Committed Helper", description: "2 weeks strong", reward: "+50 bonus points", icon: "🌟", achieved: false },
  { days: 30, title: "Monthly Champion", description: "Full month streak", reward: "+100 bonus points", icon: "🏆", achieved: false },
  { days: 60, title: "Dedication Master", description: "2 months consistent", reward: "+200 bonus points", icon: "💎", achieved: false },
  { days: 100, title: "Century Club", description: "100 day streak!", reward: "+500 bonus points", icon: "👑", achieved: false },
];

export class ActivityStreakService {
  static async getStreakData(userId: string): Promise<StreakData> {
    try {
      // Fetch activity data from impact_activities
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await supabase
        .from('impact_activities')
        .select('created_at, points_earned')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const activities = result.data as { created_at: string; points_earned: number }[] | null;
      const error = result.error;

      if (error) throw error;

      // Group activities by date
      const activityByDate = new Map<string, { count: number; points: number }>();
      
      activities?.forEach(activity => {
        const date = new Date(activity.created_at).toISOString().split('T')[0];
        const existing = activityByDate.get(date) || { count: 0, points: 0 };
        activityByDate.set(date, {
          count: existing.count + 1,
          points: existing.points + (activity.points_earned || 0)
        });
      });

      // Calculate streak
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check consecutive days going backwards
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (activityByDate.has(dateStr)) {
          tempStreak++;
          if (i === 0 || tempStreak > 0) {
            currentStreak = tempStreak;
          }
          bestStreak = Math.max(bestStreak, tempStreak);
        } else if (i > 0) {
          // Allow 1 day grace period for streaks
          if (tempStreak > 0) {
            tempStreak = 0;
          }
        }
      }

      // Build activity history for last 30 days
      const activityHistory: ActivityDay[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = activityByDate.get(dateStr);
        
        activityHistory.push({
          date: dateStr,
          hasActivity: !!dayData,
          activityCount: dayData?.count || 0,
          points: dayData?.points || 0
        });
      }

      // Calculate weekly and monthly totals
      const weeklyActivity = activityHistory.slice(-7).filter(d => d.hasActivity).length;
      const monthlyActivity = activityHistory.filter(d => d.hasActivity).length;

      const lastActivity = activities?.[0];
      const firstActivityInStreak = currentStreak > 0 
        ? new Date(today.getTime() - (currentStreak - 1) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      return {
        currentStreak,
        bestStreak,
        lastActivityDate: lastActivity?.created_at || null,
        streakStartDate: firstActivityInStreak,
        activityHistory,
        weeklyActivity,
        monthlyActivity
      };
    } catch (error) {
      console.error('Error fetching streak data:', error);
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        streakStartDate: null,
        activityHistory: [],
        weeklyActivity: 0,
        monthlyActivity: 0
      };
    }
  }

  static getMilestones(currentStreak: number): StreakMilestone[] {
    return STREAK_MILESTONES.map(milestone => ({
      ...milestone,
      achieved: currentStreak >= milestone.days
    }));
  }

  static getNextMilestone(currentStreak: number): StreakMilestone | null {
    return STREAK_MILESTONES.find(m => m.days > currentStreak) || null;
  }

  static getStreakMultiplier(streak: number): number {
    if (streak >= 100) return 2.0;
    if (streak >= 60) return 1.75;
    if (streak >= 30) return 1.5;
    if (streak >= 14) return 1.3;
    if (streak >= 7) return 1.2;
    if (streak >= 3) return 1.1;
    return 1.0;
  }

  static getStreakTips(): string[] {
    return [
      "Complete any activity to maintain your streak",
      "Help someone in your community",
      "Make a donation to a campaign",
      "Connect with another member",
      "Volunteer your time",
      "Share or engage with posts"
    ];
  }
}
