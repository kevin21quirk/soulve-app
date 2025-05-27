
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";
import { UserStats } from "@/types/gamification";
import { calculateLevelProgress } from "@/utils/gamificationUtils";

interface UserStatsCardProps {
  userStats: UserStats;
}

const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
  const levelProgress = calculateLevelProgress(userStats.totalPoints);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-6 w-6" />
          <span>Level {userStats.level}</span>
        </CardTitle>
        <CardDescription className="text-blue-100">
          {userStats.nextLevelPoints - userStats.totalPoints} points to next level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-sm text-blue-100">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.helpedCount}</div>
              <div className="text-sm text-blue-100">People Helped</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
