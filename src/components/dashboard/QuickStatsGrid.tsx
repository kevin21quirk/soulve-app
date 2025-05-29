
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, Star, Trophy, Target } from "lucide-react";
import { UserStats, Achievement } from "@/types/gamification";

interface QuickStatsGridProps {
  userStats: UserStats;
  achievements: Achievement[];
}

const QuickStatsGrid = ({ userStats, achievements }: QuickStatsGridProps) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const almostCompleteAchievements = achievements.filter(a => 
    !a.unlocked && a.progress / a.maxProgress >= 0.8
  );

  const stats = [
    {
      label: "Trust Level",
      value: userStats.level,
      subValue: `${userStats.trustScore}% Trust`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: userStats.trustLevel.replace('_', ' '),
      badgeColor: "bg-yellow-100 text-yellow-800"
    },
    {
      label: "People Helped",
      value: userStats.helpedCount,
      subValue: "This month",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "Connections",
      value: userStats.connectionsCount,
      subValue: "Active network",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Achievements",
      value: unlockedAchievements.length,
      subValue: `${achievements.length} total`,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Next Level",
      value: userStats.nextLevelPoints,
      subValue: "points needed",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Weekly Growth",
      value: "+12%",
      subValue: "vs last week",
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.bgColor} mb-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.subValue}</div>
              {stat.badge && (
                <Badge variant="outline" className={`mt-1 text-xs ${stat.badgeColor}`}>
                  {stat.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {almostCompleteAchievements.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Almost There! 🎯</h4>
            <div className="space-y-1">
              {almostCompleteAchievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="text-xs text-blue-700">
                  <span className="font-medium">{achievement.title}</span>
                  <span className="ml-2">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickStatsGrid;
