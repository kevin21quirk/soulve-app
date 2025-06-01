
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GamificationPanel = () => {
  const { toast } = useToast();
  const { recentTransactions, totalPoints, awardPoints, loading: pointsLoading } = useRealTimePoints();
  const { achievements, loading: achievementsLoading } = useUserAchievements();
  const { challenges, loading: challengesLoading } = useSeasonalChallenges();
  const [activeTab, setActiveTab] = useState("overview");

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

  const handleDemoPoints = () => {
    const demoActions = [
      { category: 'help_completed', points: 25, description: 'Demo: Helped community member' },
      { category: 'donation', points: 10, description: 'Demo: Made a donation' },
      { category: 'positive_feedback', points: 5, description: 'Demo: Received positive feedback' }
    ];
    
    const randomAction = demoActions[Math.floor(Math.random() * demoActions.length)];
    awardPoints(randomAction.category, randomAction.points, randomAction.description);
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
      {/* Demo Controls Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Demo Controls</CardTitle>
          <CardDescription className="text-blue-600">
            Test the points and achievement system with demo actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleDemoPoints}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
          >
            Demo +Points
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="social-hub"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Social Hub
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="admin-panel"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Admin Panel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="social-hub" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Hub</CardTitle>
              <CardDescription>Connect with the community and share your achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Social features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsList achievements={achievements} onClaimReward={claimReward} />
        </TabsContent>

        <TabsContent value="admin-panel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Administrative controls and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Admin features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPanel;
