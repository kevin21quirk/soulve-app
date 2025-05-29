
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bell, 
  Activity,
  Target,
  Heart,
  MessageCircle,
  Calendar,
  BarChart3
} from "lucide-react";

interface ActivityStatsProps {
  stats: {
    newNotifications: number;
    todayActivity: number;
    weeklyGrowth: number;
    totalConnections: number;
  };
}

const MobileActivityStats = ({ stats }: ActivityStatsProps) => {
  const [timeFrame, setTimeFrame] = useState("week");

  const statCards = [
    {
      title: "New Notifications",
      value: stats.newNotifications,
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      isPositive: true
    },
    {
      title: "Today's Activity",
      value: stats.todayActivity,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      isPositive: true
    },
    {
      title: "Weekly Growth",
      value: `${stats.weeklyGrowth}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3%",
      isPositive: true
    },
    {
      title: "Total Connections",
      value: stats.totalConnections,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+15",
      isPositive: true
    }
  ];

  const engagementData = [
    { type: "Likes", count: 89, icon: Heart, color: "text-red-500" },
    { type: "Comments", count: 34, icon: MessageCircle, color: "text-blue-500" },
    { type: "Connections", count: 12, icon: Users, color: "text-green-500" },
    { type: "Posts", count: 8, icon: Target, color: "text-purple-500" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Activity Insights</h1>
            <p className="text-sm text-gray-600">Your engagement overview</p>
          </div>
          <BarChart3 className="h-6 w-6 text-gray-400" />
        </div>

        {/* Time Frame Selector */}
        <div className="flex space-x-2">
          {["day", "week", "month"].map((period) => (
            <Button
              key={period}
              variant={timeFrame === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFrame(period)}
              className="text-xs capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Breakdown */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Week's Engagement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {engagementData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{item.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
                <Badge variant="outline" className="text-xs">
                  +{Math.floor(Math.random() * 20) + 1}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "2 hours ago", action: "Received 3 new messages", type: "message" },
              { time: "4 hours ago", action: "Your post got 12 likes", type: "engagement" },
              { time: "6 hours ago", action: "2 new connection requests", type: "network" },
              { time: "Yesterday", action: "Completed weekly challenge", type: "achievement" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Connections
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Target className="h-4 w-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileActivityStats;
