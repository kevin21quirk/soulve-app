
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, Eye, TrendingUp, Users, MessageCircle, Info } from "lucide-react";

interface ProfileView {
  id: string;
  viewer: {
    name: string;
    avatar: string;
  };
  viewedAt: string;
  connectionStrength: number;
}

interface ConnectionInsight {
  totalViews: number;
  weeklyGrowth: number;
  strongConnections: number;
  recentViews: ProfileView[];
}

interface ConnectionInsightsProps {
  onViewDetails: (type: string) => void;
}

const ConnectionInsights = ({ onViewDetails }: ConnectionInsightsProps) => {
  const [insights] = useState<ConnectionInsight>({
    totalViews: 47,
    weeklyGrowth: 23,
    strongConnections: 12,
    recentViews: [
      {
        id: "1",
        viewer: { name: "Sarah Johnson", avatar: "/placeholder.svg" },
        viewedAt: "2 hours ago",
        connectionStrength: 85
      },
      {
        id: "2",
        viewer: { name: "Mike Chen", avatar: "/placeholder.svg" },
        viewedAt: "5 hours ago", 
        connectionStrength: 92
      },
      {
        id: "3",
        viewer: { name: "Emma Davis", avatar: "/placeholder.svg" },
        viewedAt: "1 day ago",
        connectionStrength: 78
      }
    ]
  });

  const getStrengthColor = (strength: number) => {
    if (strength >= 90) return "bg-green-100 text-green-800";
    if (strength >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <span>Connection Analytics</span>
          <Badge variant="secondary" className="text-xs">Pro</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-800">{insights.totalViews}</p>
            <p className="text-xs text-blue-600">Profile Views</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-800">+{insights.weeklyGrowth}%</p>
            <p className="text-xs text-green-600">This Week</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-purple-800">{insights.strongConnections}</p>
            <p className="text-xs text-purple-600">Strong Bonds</p>
          </div>
        </div>

        {/* Recent Profile Views */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Recent Profile Views
          </h4>
          <div className="space-y-2">
            {insights.recentViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={view.viewer.avatar} alt={view.viewer.name} />
                    <AvatarFallback>{view.viewer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{view.viewer.name}</p>
                    <p className="text-xs text-gray-500">{view.viewedAt}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${getStrengthColor(view.connectionStrength)}`}>
                  {view.connectionStrength}% match
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="gradient"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails("analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Full Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails("tips")}
          >
            <Info className="h-4 w-4 mr-2" />
            Connection Tips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionInsights;
