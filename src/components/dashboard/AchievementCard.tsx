
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Award, Target, Gift } from "lucide-react";
import { Achievement } from "@/types/gamification";
import { getRarityColor } from "@/utils/gamificationUtils";

interface AchievementCardProps {
  achievement: Achievement;
  onClaimReward: (achievementId: string) => void;
}

const AchievementCard = ({ achievement, onClaimReward }: AchievementCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        achievement.unlocked 
          ? 'bg-green-50 border-green-200' 
          : achievement.progress >= achievement.maxProgress
          ? 'bg-yellow-50 border-yellow-200 animate-pulse'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium">{achievement.title}</h4>
              <Badge className={getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {achievement.description}
            </p>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{achievement.points} points</span>
            </div>
            {!achievement.unlocked && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {achievement.unlocked ? (
            <Badge className="bg-green-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              Unlocked
            </Badge>
          ) : achievement.progress >= achievement.maxProgress ? (
            <Button 
              size="sm" 
              onClick={() => onClaimReward(achievement.id)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Gift className="h-4 w-4 mr-1" />
              Claim
            </Button>
          ) : (
            <Badge variant="outline">
              <Target className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
