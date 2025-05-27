
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Award, Target, Crown } from "lucide-react";

interface PersonalImpactCardProps {
  userRank: number;
  totalUsers: number;
  impactScore: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topPercentile: number;
}

const PersonalImpactCard = ({ 
  userRank, 
  totalUsers, 
  impactScore, 
  weeklyGrowth, 
  monthlyGrowth, 
  topPercentile 
}: PersonalImpactCardProps) => {
  const getRankColor = (rank: number, total: number) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 5) return "from-yellow-400 to-yellow-600";
    if (percentile <= 15) return "from-purple-400 to-purple-600";
    if (percentile <= 30) return "from-blue-400 to-blue-600";
    return "from-green-400 to-green-600";
  };

  const getRankIcon = (rank: number, total: number) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 5) return Crown;
    if (percentile <= 15) return Award;
    return Target;
  };

  const RankIcon = getRankIcon(userRank, totalUsers);

  return (
    <Card className={`bg-gradient-to-br ${getRankColor(userRank, totalUsers)} text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <RankIcon className="w-full h-full" />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center space-x-2">
            <RankIcon className="h-6 w-6" />
            <span>Community Ranking</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            #{userRank}
          </Badge>
        </CardTitle>
        <CardDescription className="text-white/80">
          Top {topPercentile}% of {totalUsers.toLocaleString()} community members
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Impact Score</span>
              <span className="text-2xl font-bold">{impactScore}</span>
            </div>
            <Progress value={impactScore} className="h-3 bg-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-lg font-bold">+{weeklyGrowth}%</span>
              </div>
              <div className="text-xs text-white/80">Weekly Growth</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-lg font-bold">+{monthlyGrowth}%</span>
              </div>
              <div className="text-xs text-white/80">Monthly Growth</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalImpactCard;
