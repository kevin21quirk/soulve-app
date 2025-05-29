
import { Card, CardContent } from "@/components/ui/card";
import { UserStats, Achievement } from "@/types/gamification";

interface QuickStatsGridProps {
  userStats: UserStats;
  achievements: Achievement[];
}

const QuickStatsGrid = ({ userStats, achievements }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent mb-1">
            {userStats.connectionsCount}
          </div>
          <div className="text-xs text-gray-600">Connections</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent mb-1">
            {userStats.postsCount}
          </div>
          <div className="text-xs text-gray-600">Posts</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent mb-1">
            {userStats.likesReceived}
          </div>
          <div className="text-xs text-gray-600">Likes</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent mb-1">
            {achievements.filter(a => a.unlocked).length}
          </div>
          <div className="text-xs text-gray-600">Achievements</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsGrid;
