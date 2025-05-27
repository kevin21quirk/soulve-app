
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Heart, TrendingUp } from "lucide-react";

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
      title: "Total Connections",
      value: totalConnections,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Groups Joined",
      value: groupsJoined,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Campaigns",
      value: campaignsActive,
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {weeklyGrowth > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+{weeklyGrowth}% growth</span>
              <span className="text-gray-500">this week</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConnectionStats;
