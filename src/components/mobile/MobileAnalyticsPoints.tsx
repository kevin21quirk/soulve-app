
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Heart, Star, Trophy, Target, Shield, Award, Gift, Crown } from "lucide-react";
import { mockEnhancedUserStats, mockPointBreakdown, mockLeaderboard, mockSeasonalChallenges, mockPointTransactions } from "@/data/mockPointsData";
import { PointsCalculator } from "@/services/pointsService";
import { AchievementsService } from "@/services/achievementsService";
import { LeaderboardService } from "@/services/leaderboardService";
import { PointRedemptionService } from "@/services/pointRedemptionService";
import { useProgressTracking } from "@/hooks/useProgressTracking";

const MobileAnalyticsPoints = () => {
  const [activeTab, setActiveTab] = useState("trust");
  const userStats = mockEnhancedUserStats;
  const trustLevelConfig = PointsCalculator.getTrustLevelConfig(userStats.trustLevel);
  const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);

  // Use progress tracking hook
  const {
    achievements,
    recentPointsEarned,
    progressAnimations,
    nextLevelProgress,
    weeklyProgress,
    unlockedAchievements,
    inProgressAchievements
  } = useProgressTracking(userStats, mockPointTransactions);

  // Get leaderboard data
  const leaderboard = LeaderboardService.getLeaderboard();
  const userRank = LeaderboardService.getUserRank('current-user');

  // Get redemption rewards
  const availableRewards = PointRedemptionService.getAvailableRewards(userStats.level);

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "new_user": return Shield;
      case "verified_helper": return Star;
      case "trusted_helper": return Trophy;
      case "community_leader": return Award;
      case "impact_champion": return Crown;
      default: return Shield;
    }
  };

  const TrustIcon = getTrustLevelIcon(userStats.trustLevel);

  const quickStats = [
    {
      label: "Trust Level",
      value: userStats.level,
      subValue: `${userStats.trustScore}% Trust`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: userStats.trustLevel.replace('_', ' '),
      badgeColor: "bg-yellow-100 text-yellow-800"
    },
    {
      label: "People Helped",
      value: userStats.helpedCount,
      subValue: "This month",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "Leaderboard Rank",
      value: `#${userRank}`,
      subValue: "Community rank",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Total Points",
      value: userStats.totalPoints,
      subValue: "Lifetime earned",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="p-4 space-y-4">
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
          {/* Trust Score Header */}
          <Card className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrustIcon className="h-6 w-6" />
                  <span>{trustLevelConfig?.name || "New User"}</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Level {userStats.level}
                </Badge>
              </CardTitle>
              <CardDescription className="text-white/80">
                {nextLevel ? 
                  `${nextLevel.pointsNeeded} points to ${PointsCalculator.getTrustLevelConfig(nextLevel.level)?.name}` :
                  "Maximum level reached!"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">{userStats.trustScore}%</div>
                  <div className="text-white/80">Trust Score</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Next level progress</span>
                    <span>{nextLevelProgress.percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={nextLevelProgress.percentage} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Weekly goal</span>
                    <span>{weeklyProgress.points}/{weeklyProgress.goal}</span>
                  </div>
                  <Progress value={weeklyProgress.percentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.bgColor} mb-2`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.subValue}</div>
                    {stat.badge && (
                      <Badge variant="outline" className={`mt-1 text-xs ${stat.badgeColor}`}>
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
          {/* Recent Points Animation */}
          {recentPointsEarned.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">Recent Points Earned!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentPointsEarned.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <span className="text-sm text-green-700">{transaction.description}</span>
                      <Badge className="bg-green-600 text-white">+{transaction.points}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Points Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Points Breakdown</CardTitle>
              <CardDescription>
                How you've earned your {userStats.totalPoints} points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPointBreakdown.slice(0, 4).map((item) => {
                  const percentage = (item.totalPoints / userStats.totalPoints) * 100;
                  
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <h4 className="font-medium text-sm">{item.categoryName}</h4>
                            <p className="text-xs text-gray-500">
                              {item.transactionCount} activities
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">{item.totalPoints}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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
          {/* User Rank */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">#{userRank}</div>
                <div className="text-sm text-gray-600">Community Rank</div>
                <Badge variant="outline" className="mt-2">
                  {userStats.totalPoints} points
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Community Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.userId} 
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.userId === 'current-user' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-center">
                        {entry.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 mx-auto" />}
                        {entry.rank === 2 && <Award className="h-4 w-4 text-gray-400 mx-auto" />}
                        {entry.rank === 3 && <Award className="h-4 w-4 text-amber-600 mx-auto" />}
                        {entry.rank > 3 && <span className="text-xs font-bold">#{entry.rank}</span>}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{entry.userName}</p>
                        {entry.userId === 'current-user' && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{entry.totalPoints}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAnalyticsPoints;
