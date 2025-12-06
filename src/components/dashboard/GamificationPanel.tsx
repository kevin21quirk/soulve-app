
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedPoints } from "@/hooks/useEnhancedPoints";
import EnhancedUserStatsCard from "./EnhancedUserStatsCard";
import PointsBreakdownCard from "./PointsBreakdownCard";
import QuickStatsGrid from "./QuickStatsGrid";
import AchievementsList from "./AchievementsList";
import LeaderboardCard from "./LeaderboardCard";
import SeasonalChallengesCard from "./SeasonalChallengesCard";
import TrustScoreBreakdown from "./TrustScoreBreakdown";
import PointsDecayVisibility from "./PointsDecayVisibility";
import PointsTransactionHistory from "./PointsTransactionHistory";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useSeasonalChallenges } from "@/hooks/useSeasonalChallenges";
import { usePointsBreakdown } from "@/hooks/usePointsBreakdown";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const GamificationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { metrics, recentActivities, awardPoints, loading: pointsLoading } = useEnhancedPoints();
  const { achievements, loading: achievementsLoading } = useUserAchievements();
  const { challenges, loading: challengesLoading } = useSeasonalChallenges();
  const { breakdown, loading: breakdownLoading } = usePointsBreakdown();
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard('all-time');
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate user stats from real data
  const userStats = {
    totalPoints: metrics?.impact_score || 0,
    level: Math.floor((metrics?.impact_score || 0) / 100) + 1,
    nextLevelPoints: ((Math.floor((metrics?.impact_score || 0) / 100) + 1) * 100),
    helpedCount: metrics?.help_provided_count || 0,
    connectionsCount: metrics?.connections_count || 0,
    postsCount: 0,
    likesReceived: 0,
    trustScore: metrics?.trust_score ?? 0,
    trustLevel: (metrics?.trust_score || 0) > 80 ? 'trusted_helper' : (metrics?.trust_score || 0) > 60 ? 'verified_helper' : 'new_user' as any
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

  if (pointsLoading || achievementsLoading || challengesLoading || breakdownLoading || leaderboardLoading) {
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="real-time"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Live Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EnhancedUserStatsCard userStats={userStats} />
          <div className="grid md:grid-cols-2 gap-6">
            <PointsBreakdownCard breakdown={breakdown} totalPoints={userStats.totalPoints} />
            <QuickStatsGrid userStats={userStats} achievements={achievements} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <TrustScoreBreakdown />
            <PointsDecayVisibility />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <LeaderboardCard leaderboard={leaderboard} timeframe="all-time" />
            <SeasonalChallengesCard challenges={challenges} />
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsList achievements={achievements} onClaimReward={claimReward} />
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <PointsTransactionHistory transactions={recentActivities.map(activity => ({
            id: activity.id,
            userId: activity.user_id,
            category: activity.activity_type as any,
            points: activity.points_earned,
            multiplier: 1,
            basePoints: activity.points_earned,
            description: activity.description,
            timestamp: activity.created_at,
            verified: activity.verified,
            metadata: activity.metadata || {}
          }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPanel;
