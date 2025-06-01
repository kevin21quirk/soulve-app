import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRealTimePoints } from "@/hooks/useRealTimePoints";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useSeasonalChallenges } from "@/hooks/useSeasonalChallenges";
import { useAuth } from "@/contexts/AuthContext";
import { PointsCalculator } from "@/services/pointsService";
import { LeaderboardService } from "@/services/leaderboardService";
import { PointRedemptionService } from "@/services/pointRedemptionService";
import TrustScoreCard from "./analytics/points/TrustScoreCard";
import QuickStatsGrid from "./analytics/points/QuickStatsGrid";
import PointsBreakdownCard from "./analytics/points/PointsBreakdownCard";
import LeaderboardCard from "./analytics/points/LeaderboardCard";

const MobileAnalyticsPoints = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trust");
  const { recentTransactions, totalPoints, awardPoints, loading: pointsLoading } = useRealTimePoints();
  const { achievements, loading: achievementsLoading } = useUserAchievements();
  const { challenges, loading: challengesLoading } = useSeasonalChallenges();
  
  // Calculate user stats from real data
  const userStats = {
    totalPoints: totalPoints,
    level: Math.floor(totalPoints / 100) + 1,
    nextLevelPoints: ((Math.floor(totalPoints / 100) + 1) * 100),
    helpedCount: recentTransactions.filter(t => t.category === 'help_completed').length,
    connectionsCount: 0, // This would come from connections table
    postsCount: 0, // This would come from posts table
    likesReceived: 0, // This would come from post interactions
    trustScore: Math.min(50 + Math.floor(totalPoints / 10), 100),
    trustLevel: totalPoints > 500 ? 'trusted_helper' : totalPoints > 200 ? 'verified_helper' : 'new_user' as any
  };
  
  const trustLevelConfig = PointsCalculator.getTrustLevelConfig(userStats.trustLevel);
  const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);

  // Get leaderboard data
  const leaderboard = LeaderboardService.getLeaderboard();
  const userRank = LeaderboardService.getUserRank(user?.id || 'anonymous');

  // Get redemption rewards
  const availableRewards = PointRedemptionService.getAvailableRewards(userStats.level);

  // Calculate progress metrics
  const nextLevelProgress = {
    percentage: ((userStats.totalPoints % 100) / 100) * 100,
    pointsNeeded: userStats.nextLevelPoints - userStats.totalPoints
  };

  const weeklyProgress = {
    points: recentTransactions
      .filter(t => new Date(t.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.points, 0),
    goal: 200,
    percentage: 0,
    transactionCount: recentTransactions.length
  };
  weeklyProgress.percentage = Math.min((weeklyProgress.points / weeklyProgress.goal) * 100, 100);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);

  // Demo function - functional now
  const handleDemoPoints = () => {
    if (!user) {
      alert("Please log in to earn points!");
      return;
    }

    const demoActions = [
      { category: 'help_completed', points: 25, description: 'Helped community member with groceries' },
      { category: 'donation', points: 10, description: 'Donated to local food bank' },
      { category: 'positive_feedback', points: 5, description: 'Received 5-star rating' }
    ];
    
    const randomAction = demoActions[Math.floor(Math.random() * demoActions.length)];
    awardPoints(randomAction.category, randomAction.points, randomAction.description);
  };

  if (pointsLoading || achievementsLoading || challengesLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Real-time Points Display */}
      {recentTransactions.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Recent Points Earned! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <span className="text-sm text-green-700">{transaction.description}</span>
                  <Badge className="bg-green-600 text-white">+{transaction.points}</Badge>
                </div>
              ))}
            </div>
            <Button 
              size="sm" 
              onClick={handleDemoPoints}
              className="mt-3 w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
              disabled={!user}
            >
              {user ? "Demo: Earn More Points" : "Log in to Earn Points"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="trust"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Trust
          </TabsTrigger>
          <TabsTrigger 
            value="points"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Points
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Rewards
            {unlockedAchievements.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unlockedAchievements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Ranks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trust" className="space-y-4 mt-4">
          <TrustScoreCard 
            userStats={userStats}
            trustLevelConfig={trustLevelConfig}
            nextLevel={nextLevel}
            nextLevelProgress={nextLevelProgress}
            weeklyProgress={weeklyProgress}
          />
          
          <QuickStatsGrid userStats={userStats} userRank={userRank} />

          {/* Trust Level Benefits */}
          {trustLevelConfig?.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Level Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trustLevelConfig.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                  {trustLevelConfig.benefits.length > 3 && (
                    <li className="text-gray-500 text-xs">
                      +{trustLevelConfig.benefits.length - 3} more benefits...
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="points" className="space-y-4 mt-4">
          <PointsBreakdownCard userStats={userStats} />

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenges.slice(0, 2).map((challenge) => {
                  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
                  
                  return (
                    <div key={challenge.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{challenge.title}</h4>
                          <p className="text-xs text-gray-600 truncate">{challenge.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                          {challenge.pointMultiplier}x
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                  );
                })}
                {challenges.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No active challenges at the moment
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          {/* Achievements Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements & Rewards</CardTitle>
              <CardDescription>
                Unlock rewards and show off your accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{unlockedAchievements.length}</div>
                  <div className="text-xs text-gray-600">Unlocked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{inProgressAchievements.length}</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{availableRewards.length}</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unlockedAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        +{achievement.pointsReward}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redeem Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRewards.slice(0, 3).map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{reward.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{reward.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{reward.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        size="sm" 
                        className={`${userStats.totalPoints >= reward.pointsCost 
                          ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200' 
                          : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                        disabled={userStats.totalPoints < reward.pointsCost || !user}
                      >
                        {reward.pointsCost} pts
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 mt-4">
          <LeaderboardCard 
            userRank={userRank}
            userStats={userStats}
            leaderboard={leaderboard}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAnalyticsPoints;
