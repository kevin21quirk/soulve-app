
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Users2, Heart, TrendingUp } from "lucide-react";

interface ConnectionStatsProps {
  totalConnections: number;
  pendingRequests: number;
  groupsJoined: number;
  campaignsActive: number;
  weeklyGrowth: number;
}

const ConnectionStats = ({ 
  totalConnections, 
  pendingRequests, 
  groupsJoined, 
  campaignsActive, 
  weeklyGrowth 
}: ConnectionStatsProps) => {
  const stats = [
    {
      label: "Total Connections",
      value: totalConnections,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: `+${weeklyGrowth}% this week`
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: pendingRequests > 0 ? "Needs attention" : "All caught up"
    },
    {
      label: "Groups Joined",
      value: groupsJoined,
      icon: Users2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "Active communities"
    },
    {
      label: "Active Campaigns",
      value: campaignsActive,
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "Making impact"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ConnectionStats;
