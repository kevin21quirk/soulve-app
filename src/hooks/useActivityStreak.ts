import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityStreakService, StreakData, StreakMilestone } from '@/services/activityStreakService';

export const useActivityStreak = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [milestones, setMilestones] = useState<StreakMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreakData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await ActivityStreakService.getStreakData(user.id);
        setStreakData(data);
        setMilestones(ActivityStreakService.getMilestones(data.currentStreak));
      } catch (error) {
        console.error('Error loading streak data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreakData();
  }, [user?.id]);

  const nextMilestone = streakData 
    ? ActivityStreakService.getNextMilestone(streakData.currentStreak) 
    : null;

  const streakMultiplier = streakData 
    ? ActivityStreakService.getStreakMultiplier(streakData.currentStreak) 
    : 1.0;

  const streakTips = ActivityStreakService.getStreakTips();

  return {
    streakData,
    milestones,
    nextMilestone,
    streakMultiplier,
    streakTips,
    loading
  };
};
