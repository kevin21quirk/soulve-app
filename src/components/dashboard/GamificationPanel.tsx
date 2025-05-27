
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from "@/types/gamification";
import EnhancedUserStatsCard from "./EnhancedUserStatsCard";
import PointsBreakdownCard from "./PointsBreakdownCard";
import QuickStatsGrid from "./QuickStatsGrid";
import AchievementsList from "./AchievementsList";
import { mockEnhancedUserStats, mockPointBreakdown } from "@/data/mockPointsData";

const GamificationPanel = () => {
  const { toast } = useToast();
  const [userStats] = useState(mockEnhancedUserStats);

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
      description: "Reach Trusted Helper status",
      icon: "⭐",
      points: 300,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
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
    },
    {
      id: "6",
      title: "Emergency Hero",
      description: "Complete 5 emergency help requests",
      icon: "🚨",
      points: 500,
      unlocked: false,
      progress: 1,
      maxProgress: 5,
      rarity: "epic"
    },
    {
      id: "7",
      title: "Generous Giver",
      description: "Donate £500 total",
      icon: "💝",
      points: 200,
      unlocked: false,
      progress: 350,
      maxProgress: 500,
      rarity: "rare"
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
      <EnhancedUserStatsCard userStats={userStats} />
      <div className="grid md:grid-cols-2 gap-6">
        <PointsBreakdownCard breakdown={mockPointBreakdown} totalPoints={userStats.totalPoints} />
        <QuickStatsGrid userStats={userStats} achievements={achievements} />
      </div>
      <AchievementsList achievements={achievements} onClaimReward={claimReward} />
    </div>
  );
};

export default GamificationPanel;
