
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Star, Trophy, Award, Crown } from "lucide-react";

interface TrustScoreCardProps {
  userStats: any;
  trustLevelConfig: any;
  nextLevel: any;
  nextLevelProgress: any;
  weeklyProgress: any;
}

const TrustScoreCard = ({ 
  userStats, 
  trustLevelConfig, 
  nextLevel, 
  nextLevelProgress, 
  weeklyProgress 
}: TrustScoreCardProps) => {
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

  return (
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
            `${nextLevel.pointsNeeded} points to ${trustLevelConfig?.name}` :
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
  );
};

export default TrustScoreCard;
