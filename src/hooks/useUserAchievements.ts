
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement } from '@/types/gamification';

const achievementDefinitions: Record<string, Omit<Achievement, 'id' | 'unlocked' | 'progress'>> = {
  // Helping Achievements
  first_helper: { title: "First Helper", description: "Help your first community member", icon: "🤝", points: 50, pointsReward: 50, maxProgress: 1, rarity: "common" },
  helping_hand: { title: "Helping Hand", description: "Help 10 people in your community", icon: "🙌", points: 100, pointsReward: 100, maxProgress: 10, rarity: "common" },
  community_champion: { title: "Community Champion", description: "Help 25 people", icon: "🏆", points: 250, pointsReward: 250, maxProgress: 25, rarity: "rare" },
  super_helper: { title: "Super Helper", description: "Help 50 people", icon: "⭐", points: 400, pointsReward: 400, maxProgress: 50, rarity: "epic" },
  legend_helper: { title: "Legend Helper", description: "Help 100 people", icon: "👑", points: 1000, pointsReward: 1000, maxProgress: 100, rarity: "legendary" },
  
  // Donating Achievements
  first_donation: { title: "First Donation", description: "Make your first donation", icon: "💸", points: 50, pointsReward: 50, maxProgress: 1, rarity: "common" },
  generous_giver: { title: "Generous Giver", description: "Donate £100 total", icon: "💝", points: 200, pointsReward: 200, maxProgress: 100, rarity: "rare" },
  philanthropist: { title: "Philanthropist", description: "Donate £500 total", icon: "💎", points: 500, pointsReward: 500, maxProgress: 500, rarity: "epic" },
  major_donor: { title: "Major Donor", description: "Donate £1,000 total", icon: "🎖️", points: 1000, pointsReward: 1000, maxProgress: 1000, rarity: "legendary" },
  
  // Social Achievements
  first_connection: { title: "First Connection", description: "Make your first connection", icon: "🔗", points: 25, pointsReward: 25, maxProgress: 1, rarity: "common" },
  social_butterfly: { title: "Social Butterfly", description: "Make 10 connections", icon: "🦋", points: 100, pointsReward: 100, maxProgress: 10, rarity: "common" },
  network_builder: { title: "Network Builder", description: "Make 25 connections", icon: "🌐", points: 200, pointsReward: 200, maxProgress: 25, rarity: "rare" },
  community_connector: { title: "Community Connector", description: "Make 50 connections", icon: "🤝", points: 400, pointsReward: 400, maxProgress: 50, rarity: "epic" },
  
  // Volunteering Achievements
  first_volunteer: { title: "First Volunteer", description: "Log your first volunteer hour", icon: "⏱️", points: 50, pointsReward: 50, maxProgress: 1, rarity: "common" },
  volunteer_hero: { title: "Volunteer Hero", description: "Log 10 volunteer hours", icon: "🦸", points: 150, pointsReward: 150, maxProgress: 10, rarity: "common" },
  dedicated_volunteer: { title: "Dedicated Volunteer", description: "Log 50 volunteer hours", icon: "🏅", points: 400, pointsReward: 400, maxProgress: 50, rarity: "rare" },
  volunteer_champion: { title: "Volunteer Champion", description: "Log 100 volunteer hours", icon: "🎯", points: 800, pointsReward: 800, maxProgress: 100, rarity: "epic" },
  
  // Streak Achievements
  week_warrior: { title: "Week Warrior", description: "7-day activity streak", icon: "🔥", points: 100, pointsReward: 100, maxProgress: 7, rarity: "common" },
  streak_master: { title: "Streak Master", description: "30-day activity streak", icon: "⚡", points: 300, pointsReward: 300, maxProgress: 30, rarity: "rare" },
  century_club: { title: "Century Club", description: "100-day activity streak", icon: "💯", points: 1000, pointsReward: 1000, maxProgress: 100, rarity: "legendary" },
  
  // Trust Achievements
  verified_member: { title: "Verified Member", description: "Complete profile verification", icon: "✅", points: 100, pointsReward: 100, maxProgress: 1, rarity: "common" },
  trusted_helper: { title: "Trusted Helper", description: "Reach 60% trust score", icon: "🛡️", points: 300, pointsReward: 300, maxProgress: 60, rarity: "epic" },
  community_pillar: { title: "Community Pillar", description: "Reach 90% trust score", icon: "🏛️", points: 500, pointsReward: 500, maxProgress: 90, rarity: "legendary" },
  
  // Special Achievements
  early_adopter: { title: "Early Adopter", description: "Join in the first year", icon: "🚀", points: 200, pointsReward: 200, maxProgress: 1, rarity: "rare" },
  campaign_creator: { title: "Campaign Creator", description: "Create your first campaign", icon: "📢", points: 150, pointsReward: 150, maxProgress: 1, rarity: "common" },
  fundraiser_success: { title: "Fundraiser Success", description: "Reach a campaign goal", icon: "🎉", points: 500, pointsReward: 500, maxProgress: 1, rarity: "epic" }
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
