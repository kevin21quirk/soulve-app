
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Star, Trophy } from "lucide-react";
import { UserStats } from "@/types/gamification";
import { PointsCalculator } from "@/services/pointsService";

interface EnhancedUserStatsCardProps {
  userStats: UserStats;
}

const EnhancedUserStatsCard = ({ userStats }: EnhancedUserStatsCardProps) => {
  const trustLevelConfig = PointsCalculator.getTrustLevelConfig(userStats.trustLevel);
  const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);
  
  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "new_user": return Shield;
      case "verified_helper": return Star;
      case "trusted_helper": return Crown;
      case "community_leader": return Trophy;
      case "impact_champion": return Crown;
      default: return Shield;
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "new_user": return "from-gray-500 to-gray-600";
      case "verified_helper": return "from-blue-500 to-blue-600";
      case "trusted_helper": return "from-green-500 to-green-600";
      case "community_leader": return "from-purple-500 to-purple-600";
      case "impact_champion": return "from-yellow-500 to-yellow-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const TrustIcon = getTrustLevelIcon(userStats.trustLevel);
  const progressToNext = nextLevel ? 
    ((userStats.totalPoints - (trustLevelConfig?.minPoints || 0)) / 
     (nextLevel.pointsNeeded + userStats.totalPoints - (trustLevelConfig?.minPoints || 0))) * 100 
    : 100;

  return (
    <Card className={`bg-gradient-to-r ${getTrustLevelColor(userStats.trustLevel)} text-white`}>
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
          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {PointsCalculator.getTrustLevelConfig(nextLevel.level)?.name}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-sm text-white/80">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.trustScore}%</div>
              <div className="text-sm text-white/80">Trust Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-semibold">{userStats.helpedCount}</div>
              <div className="text-white/80">People Helped</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{userStats.connectionsCount}</div>
              <div className="text-white/80">Connections</div>
            </div>
          </div>

          {trustLevelConfig?.benefits && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Level Benefits</h4>
              <ul className="text-xs space-y-1">
                {trustLevelConfig.benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                    <span>{benefit}</span>
                  </li>
                ))}
                {trustLevelConfig.benefits.length > 2 && (
                  <li className="text-white/60">+{trustLevelConfig.benefits.length - 2} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedUserStatsCard;
