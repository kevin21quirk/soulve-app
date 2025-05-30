
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Heart, Users, Star } from "lucide-react";

interface QuickStatsGridProps {
  userStats: any;
  userRank: number;
}

const QuickStatsGrid = ({ userStats, userRank }: QuickStatsGridProps) => {
  const quickStats = [
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
      label: "Leaderboard Rank",
      value: `#${userRank}`,
      subValue: "Community rank",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Total Points",
      value: userStats.totalPoints,
      subValue: "Lifetime earned",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
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
      </CardContent>
    </Card>
  );
};

export default QuickStatsGrid;
