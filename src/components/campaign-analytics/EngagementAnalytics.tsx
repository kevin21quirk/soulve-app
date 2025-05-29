
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Bookmark, Eye } from "lucide-react";

const EngagementAnalytics = () => {
  // Mock data for demonstration
  const engagementTypes = [
    { name: "Likes", value: 342, color: "#ef4444" },
    { name: "Comments", value: 128, color: "#3b82f6" },
    { name: "Shares", value: 89, color: "#10b981" },
    { name: "Bookmarks", value: 67, color: "#f59e0b" },
  ];

  const engagementTrend = [
    { date: "Week 1", likes: 45, comments: 12, shares: 8 },
    { date: "Week 2", likes: 78, comments: 23, shares: 15 },
    { date: "Week 3", likes: 92, comments: 31, shares: 22 },
    { date: "Week 4", likes: 125, comments: 45, shares: 28 },
    { date: "Week 5", likes: 158, comments: 52, shares: 35 },
  ];

  const socialMetrics = [
    { platform: "Facebook", shares: 45, reach: 1250, engagement: 8.2 },
    { platform: "Twitter", shares: 32, reach: 890, engagement: 6.5 },
    { platform: "LinkedIn", shares: 18, reach: 560, engagement: 12.1 },
    { platform: "Instagram", shares: 28, reach: 980, engagement: 9.8 },
  ];

  const getEngagementIcon = (type: string) => {
    switch (type) {
      case "Likes": return <Heart className="h-4 w-4 text-red-500" />;
      case "Comments": return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "Shares": return <Share2 className="h-4 w-4 text-green-500" />;
      case "Bookmarks": return <Bookmark className="h-4 w-4 text-yellow-500" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementTypes.map((type) => (
          <Card key={type.name}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {getEngagementIcon(type.name)}
                <div>
                  <div className="text-sm text-gray-600">{type.name}</div>
                  <div className="text-2xl font-bold">{type.value}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {engagementTypes.map((type) => (
                <Badge key={type.name} variant="outline" style={{ borderColor: type.color }}>
                  {type.name}: {type.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="likes" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="shares" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialMetrics.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {platform.platform[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{platform.platform}</div>
                    <div className="text-sm text-gray-600">{platform.shares} shares • {platform.reach} reach</div>
                  </div>
                </div>
                <Badge variant={platform.engagement > 8 ? "default" : "secondary"}>
                  {platform.engagement}% engagement
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Most Engaged Platform</h4>
              <p className="text-blue-700">LinkedIn (12.1% engagement rate)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Growth Rate</h4>
              <p className="text-green-700">+28% engagement this month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Best Content Type</h4>
              <p className="text-purple-700">Story updates get 3x more likes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementAnalytics;
