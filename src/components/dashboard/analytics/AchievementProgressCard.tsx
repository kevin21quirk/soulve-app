
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  icon: LucideIcon;
  category: string;
}

interface AchievementProgressData {
  achievements: Achievement[];
  totalPoints: number;
  unlockedCount: number;
  nextMilestone: {
    title: string;
    pointsNeeded: number;
  };
}

const AchievementProgressCard = ({
  achievements,
  totalPoints,
  unlockedCount,
  nextMilestone
}: AchievementProgressData) => {
  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Achievement Progress</span>
          <Badge variant="secondary">
            {totalPoints.toLocaleString()} points
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points Overview */}
        <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Total Points • {unlockedCount} achievements unlocked
          </div>
        </div>

        {/* Next Milestone */}
        <div className="p-3 border rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Next Milestone: {nextMilestone.title}
          </div>
          <div className="text-xs text-gray-500 mb-1">
            {nextMilestone.pointsNeeded} points needed
          </div>
          <Progress 
            value={((totalPoints) / (totalPoints + nextMilestone.pointsNeeded)) * 100} 
            className="h-2" 
          />
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Recent Progress</div>
          {achievements.slice(0, 3).map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div 
                key={achievement.id} 
                className={`p-3 border rounded-lg ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${
                    achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {achievement.title}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={getRarityColor(achievement.rarity)}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {achievement.description}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        <span>{achievement.points} pts</span>
                      </div>
                      <Progress value={progressPercentage} className="h-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementProgressCard;
