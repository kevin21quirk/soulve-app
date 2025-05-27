
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Achievement } from "@/types/gamification";
import AchievementCard from "./AchievementCard";

interface AchievementsListProps {
  achievements: Achievement[];
  onClaimReward: (achievementId: string) => void;
}

const AchievementsList = ({ achievements, onClaimReward }: AchievementsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>Track your progress and unlock rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClaimReward={onClaimReward}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsList;
