
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Heart, Star, Trophy, Target, Shield, Award } from "lucide-react";
import { mockEnhancedUserStats, mockPointBreakdown, mockLeaderboard, mockSeasonalChallenges, mockPointTransactions } from "@/data/mockPointsData";
import { PointsCalculator } from "@/services/pointsService";

const MobileAnalyticsPoints = () => {
  const [activeTab, setActiveTab] = useState("trust");
  const userStats = mockEnhancedUserStats;
  const trustLevelConfig = PointsCalculator.getTrustLevelConfig(userStats.trustLevel);
  const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "new_user": return Shield;
      case "verified_helper": return Star;
      case "trusted_helper": return Trophy;
      case "community_leader": return Award;
      case "impact_champion": return Trophy;
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
      label: "Connections",
      value: userStats.connectionsCount,
      subValue: "Active network",
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trust">Trust Score</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
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
                
                {nextLevel && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to next level</span>
                      <span>{userStats.totalPoints}/{userStats.totalPoints + nextLevel.pointsNeeded}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
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

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPointTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-bold text-green-600">+{transaction.points}</span>
                    </div>
                  </div>
                ))}
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
      </Tabs>
    </div>
  );
};

export default MobileAnalyticsPoints;
