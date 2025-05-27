
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Achievement, UserStats } from "@/types/gamification";
import UserStatsCard from "./UserStatsCard";
import QuickStatsGrid from "./QuickStatsGrid";
import AchievementsList from "./AchievementsList";

const GamificationPanel = () => {
  const { toast } = useToast();
  const [userStats] = useState<UserStats>({
    totalPoints: 1250,
    level: 5,
    nextLevelPoints: 1500,
    helpedCount: 23,
    connectionsCount: 42,
    postsCount: 15,
    likesReceived: 156
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Helper",
      description: "Help your first community member",
      icon: "🤝",
      points: 50,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: "common"
    },
    {
      id: "2",
      title: "Social Butterfly",
      description: "Make 10 connections",
      icon: "🦋",
      points: 100,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      rarity: "common"
    },
    {
      id: "3",
      title: "Community Champion",
      description: "Help 25 people",
      icon: "🏆",
      points: 250,
      unlocked: false,
      progress: 23,
      maxProgress: 25,
      rarity: "rare"
    },
    {
      id: "4",
      title: "Trusted Helper",
      description: "Reach 95% trust score",
      icon: "⭐",
      points: 300,
      unlocked: true,
      progress: 95,
      maxProgress: 95,
      rarity: "epic"
    },
    {
      id: "5",
      title: "Master Networker",
      description: "Connect with 100 people",
      icon: "👑",
      points: 500,
      unlocked: false,
      progress: 42,
      maxProgress: 100,
      rarity: "legendary"
    }
  ]);

  const claimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievementId ? { ...a, unlocked: true } : a
        )
      );
      
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `You earned "${achievement.title}" and gained ${achievement.points} points!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <UserStatsCard userStats={userStats} />
      <QuickStatsGrid userStats={userStats} achievements={achievements} />
      <AchievementsList achievements={achievements} onClaimReward={claimReward} />
    </div>
  );
};

export default GamificationPanel;
