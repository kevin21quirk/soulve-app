
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
        <CardContent className="pt-6 pb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            {userStats.connectionsCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">Connections</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6 pb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            {userStats.postsCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">Posts</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6 pb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            {userStats.likesReceived}
          </div>
          <div className="text-sm text-gray-600 mt-1">Likes</div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6 pb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            {achievements.filter(a => a.unlocked).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Achievements</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsGrid;
