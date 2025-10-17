import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PointBreakdown } from '@/types/gamification';

const CATEGORY_CONFIG: Record<string, { name: string; icon: string; color: string }> = {
  'help_completed': { name: 'Help Completed', icon: '🤝', color: 'blue' },
  'help_provided': { name: 'Help Provided', icon: '❤️', color: 'red' },
  'donation': { name: 'Donations', icon: '💰', color: 'green' },
  'recurring_donation': { name: 'Recurring Donations', icon: '💝', color: 'emerald' },
  'volunteer': { name: 'Volunteer Work', icon: '🌟', color: 'yellow' },
  'volunteer_hour': { name: 'Volunteer Hours', icon: '⏰', color: 'orange' },
  'connection': { name: 'Connections', icon: '👥', color: 'purple' },
  'profile_verification': { name: 'Verifications', icon: '✅', color: 'cyan' },
  'positive_feedback': { name: 'Positive Feedback', icon: '⭐', color: 'pink' },
  'user_referral': { name: 'Referrals', icon: '🎁', color: 'indigo' },
  'emergency_help': { name: 'Emergency Help', icon: '🚨', color: 'red' },
};

export const usePointsBreakdown = () => {
  const { user } = useAuth();
  const [breakdown, setBreakdown] = useState<PointBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBreakdown = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Aggregate points by category
      const { data: activities } = await supabase
        .from('impact_activities')
        .select('activity_type, points_earned, created_at, points_state')
        .eq('user_id', user.id)
        .eq('verified', true)
        .eq('points_state', 'active');

      if (!activities) {
        setBreakdown([]);
        setLoading(false);
        return;
      }

      // Group by activity type
      const categoryMap: Record<string, {
        totalPoints: number;
        transactionCount: number;
        lastActivity: string;
      }> = {};

      activities.forEach(activity => {
        const type = activity.activity_type;
        if (!categoryMap[type]) {
          categoryMap[type] = {
            totalPoints: 0,
            transactionCount: 0,
            lastActivity: activity.created_at
          };
        }
        categoryMap[type].totalPoints += activity.points_earned || 0;
        categoryMap[type].transactionCount++;
        
        // Keep most recent date
        if (new Date(activity.created_at) > new Date(categoryMap[type].lastActivity)) {
          categoryMap[type].lastActivity = activity.created_at;
        }
      });

      // Convert to PointBreakdown array
      const breakdownData: PointBreakdown[] = Object.entries(categoryMap)
        .map(([category, data]) => {
          const config = CATEGORY_CONFIG[category] || {
            name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            icon: '📊',
            color: 'gray'
          };

          return {
            category: category as any,
            categoryName: config.name,
            totalPoints: data.totalPoints,
            transactionCount: data.transactionCount,
            lastActivity: new Date(data.lastActivity).toISOString().split('T')[0],
            icon: config.icon,
            color: config.color as any
          };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints);

      setBreakdown(breakdownData);
    } catch (error) {
      console.error('Error fetching points breakdown:', error);
      setBreakdown([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakdown();

    // Real-time subscription
    if (!user?.id) return;

    const channel = supabase
      .channel('points-breakdown-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_activities',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchBreakdown();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    breakdown,
    loading,
    refetch: fetchBreakdown
  };
};
