
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement } from '@/types/gamification';

const achievementDefinitions: Record<string, Omit<Achievement, 'id' | 'unlocked' | 'progress'>> = {
  first_helper: {
    title: "First Helper",
    description: "Help your first community member",
    icon: "🤝",
    points: 50,
    pointsReward: 50,
    maxProgress: 1,
    rarity: "common"
  },
  community_champion: {
    title: "Community Champion",
    description: "Help 25 people",
    icon: "🏆",
    points: 250,
    pointsReward: 250,
    maxProgress: 25,
    rarity: "rare"
  },
  generous_giver: {
    title: "Generous Giver",
    description: "Donate $500 total",
    icon: "💝",
    points: 200,
    pointsReward: 200,
    maxProgress: 500,
    rarity: "rare"
  },
  trusted_helper: {
    title: "Trusted Helper",
    description: "Reach Trusted Helper status",
    icon: "⭐",
    points: 300,
    pointsReward: 300,
    maxProgress: 1,
    rarity: "epic"
  },
  social_butterfly: {
    title: "Social Butterfly",
    description: "Make 10 connections",
    icon: "🦋",
    points: 100,
    pointsReward: 100,
    maxProgress: 10,
    rarity: "common"
  }
};

export const useUserAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadAchievements();
  }, [user?.id]);

  const loadAchievements = async () => {
    if (!user?.id) return;

    try {
      // Get user's unlocked achievements
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Combine with achievement definitions
      const allAchievements: Achievement[] = Object.entries(achievementDefinitions).map(([id, def]) => {
        const userAchievement = userAchievements?.find(ua => ua.achievement_id === id);
        
        return {
          id,
          ...def,
          unlocked: !!userAchievement,
          unlockedAt: userAchievement?.unlocked_at,
          progress: userAchievement?.progress || 0
        };
      });

      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    achievements,
    loading,
    refetch: loadAchievements
  };
};
