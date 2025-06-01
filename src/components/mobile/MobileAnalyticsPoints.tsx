
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockEnhancedUserStats, mockPointBreakdown, mockLeaderboard, mockSeasonalChallenges, mockPointTransactions } from "@/data/mockPointsData";
import { PointsCalculator } from "@/services/pointsService";
import { LeaderboardService } from "@/services/leaderboardService";
import { PointRedemptionService } from "@/services/pointRedemptionService";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useRealTimePoints } from "@/hooks/useRealTimePoints";
import TrustScoreCard from "./analytics/points/TrustScoreCard";
import QuickStatsGrid from "./analytics/points/QuickStatsGrid";
import PointsBreakdownCard from "./analytics/points/PointsBreakdownCard";
import LeaderboardCard from "./analytics/points/LeaderboardCard";

const MobileAnalyticsPoints = () => {
  const [activeTab, setActiveTab] = useState("trust");
  const { recentTransactions, totalPoints, awardPoints } = useRealTimePoints();
  
  // Use real-time total points if available, otherwise use mock data
  const userStats = {
    ...mockEnhancedUserStats,
    totalPoints: totalPoints || mockEnhancedUserStats.totalPoints
  };
  
  const trustLevelConfig = PointsCalculator.getTrustLevelConfig(userStats.trustLevel);
  const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);

  // Use progress tracking hook
  const {
    achievements,
    progressAnimations,
    nextLevelProgress,
    weeklyProgress,
    unlockedAchievements,
    inProgressAchievements
  } = useProgressTracking(userStats, [...recentTransactions, ...mockPointTransactions]);

  // Get leaderboard data
  const leaderboard = LeaderboardService.getLeaderboard();
  const userRank = LeaderboardService.getUserRank('current-user');

  // Get redemption rewards
  const availableRewards = PointRedemptionService.getAvailableRewards(userStats.level);

  // Demo function
  const handleDemoPoints = () => {
    const demoActions = [
      { category: 'help_completed', points: 25, description: 'Helped community member with groceries' },
      { category: 'donation', points: 10, description: 'Donated to local food bank' },
      { category: 'positive_feedback', points: 5, description: 'Received 5-star rating' }
    ];
    
    const randomAction = demoActions[Math.floor(Math.random() * demoActions.length)];
    awardPoints(randomAction.category, randomAction.points, randomAction.description);
  };

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
              variant="outline" 
              size="sm" 
              onClick={handleDemoPoints}
              className="mt-3 w-full"
            >
              Demo: Earn More Points
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trust">Trust</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="achievements">
            Rewards
            {unlockedAchievements.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unlockedAchievements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="leaderboard">Ranks</TabsTrigger>
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
                {mockSeasonalChallenges.slice(0, 2).map((challenge) => {
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
                        variant={userStats.totalPoints >= reward.pointsCost ? "default" : "outline"}
                        disabled={userStats.totalPoints < reward.pointsCost}
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
