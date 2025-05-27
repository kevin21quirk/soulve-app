
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Crown, Shield, Target } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface AchievementProgressCardProps {
  achievements: Achievement[];
  totalPoints: number;
  unlockedCount: number;
  nextMilestone: { title: string; pointsNeeded: number };
}

const AchievementProgressCard = ({ 
  achievements, 
  totalPoints, 
  unlockedCount, 
  nextMilestone 
}: AchievementProgressCardProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const nearCompletion = achievements.filter(a => !a.unlocked && a.progress / a.maxProgress >= 0.8);
  const recentlyUnlocked = achievements.filter(a => a.unlocked).slice(-3);

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span>Achievement Progress</span>
          <Badge className="bg-amber-100 text-amber-800">
            {unlockedCount}/{achievements.length} Unlocked
          </Badge>
        </CardTitle>
        <CardDescription>
          Your journey to community mastery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{totalPoints}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{unlockedCount}</div>
              <div className="text-xs text-gray-600">Unlocked</div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{nearCompletion.length}</div>
              <div className="text-xs text-gray-600">Near Complete</div>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="p-4 bg-white/60 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Next Milestone</span>
              <Badge variant="outline">{nextMilestone.pointsNeeded} points needed</Badge>
            </div>
            <div className="text-lg font-semibold text-amber-700 mb-2">{nextMilestone.title}</div>
            <Progress value={75} className="h-2" />
          </div>

          {/* Recently Unlocked */}
          {recentlyUnlocked.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Recently Unlocked</h4>
              <div className="space-y-2">
                {recentlyUnlocked.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-white/60 rounded-lg">
                    <achievement.icon className="h-5 w-5 text-amber-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.category}</div>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Near Completion */}
          {nearCompletion.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Almost There!</h4>
              <div className="space-y-3">
                {nearCompletion.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <achievement.icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{achievement.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementProgressCard;
