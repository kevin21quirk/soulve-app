
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from "@/types/gamification";
import EnhancedUserStatsCard from "./EnhancedUserStatsCard";
import PointsBreakdownCard from "./PointsBreakdownCard";
import QuickStatsGrid from "./QuickStatsGrid";
import AchievementsList from "./AchievementsList";
import LeaderboardCard from "./LeaderboardCard";
import SeasonalChallengesCard from "./SeasonalChallengesCard";
import PointsTransactionHistory from "./PointsTransactionHistory";
import { useRealTimePoints } from "@/hooks/useRealTimePoints";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useSeasonalChallenges } from "@/hooks/useSeasonalChallenges";
import { mockPointBreakdown, mockLeaderboard } from "@/data/mockPointsData";

const GamificationPanel = () => {
  const { toast } = useToast();
  const { recentTransactions, totalPoints, loading: pointsLoading } = useRealTimePoints();
  const { achievements, loading: achievementsLoading } = useUserAchievements();
  const { challenges, loading: challengesLoading } = useSeasonalChallenges();

  // Calculate user stats from real data
  const userStats = {
    totalPoints: totalPoints,
    level: Math.floor(totalPoints / 100) + 1,
    nextLevelPoints: ((Math.floor(totalPoints / 100) + 1) * 100),
    helpedCount: recentTransactions.filter(t => t.category === 'help_completed').length,
    connectionsCount: 0, // This would come from connections table when implemented
    postsCount: 0, // This would come from posts table when implemented
    likesReceived: 0, // This would come from post interactions when implemented
    trustScore: Math.min(50 + Math.floor(totalPoints / 10), 100),
    trustLevel: totalPoints > 500 ? 'trusted_helper' : totalPoints > 200 ? 'verified_helper' : 'new_user' as any
  };

  const claimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `You earned "${achievement.title}" and gained ${achievement.pointsReward} points!`,
      });
    }
  };

  if (pointsLoading || achievementsLoading || challengesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnhancedUserStatsCard userStats={userStats} />
      <div className="grid md:grid-cols-2 gap-6">
        <PointsBreakdownCard breakdown={mockPointBreakdown} totalPoints={userStats.totalPoints} />
        <QuickStatsGrid userStats={userStats} achievements={achievements} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <LeaderboardCard leaderboard={mockLeaderboard} timeframe="all-time" />
        <SeasonalChallengesCard challenges={challenges} />
      </div>
      <PointsTransactionHistory transactions={recentTransactions} />
      <AchievementsList achievements={achievements} onClaimReward={claimReward} />
    </div>
  );
};

export default GamificationPanel;
