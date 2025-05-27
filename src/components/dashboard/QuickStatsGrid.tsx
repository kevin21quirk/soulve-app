
import { Card, CardContent } from "@/components/ui/card";
import { UserStats, Achievement } from "@/types/gamification";

interface QuickStatsGridProps {
  userStats: UserStats;
  achievements: Achievement[];
}

const QuickStatsGrid = ({ userStats, achievements }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="text-center">
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-blue-600">{userStats.connectionsCount}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-green-600">{userStats.postsCount}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-red-600">{userStats.likesReceived}</div>
          <div className="text-sm text-gray-600">Likes</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-purple-600">
            {achievements.filter(a => a.unlocked).length}
          </div>
          <div className="text-sm text-gray-600">Achievements</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsGrid;
