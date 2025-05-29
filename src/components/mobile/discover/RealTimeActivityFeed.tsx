
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Heart, MessageCircle, UserPlus, Share2, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "like" | "comment" | "connection" | "share" | "post";
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  timestamp: string;
  isNew: boolean;
}

interface RealTimeActivityFeedProps {
  onViewProfile: (userId: string) => void;
}

const RealTimeActivityFeed = ({ onViewProfile }: RealTimeActivityFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "connection",
      user: { name: "Sarah Kim", avatar: "/placeholder.svg" },
      action: "connected with you",
      timestamp: "2 min ago",
      isNew: true
    },
    {
      id: "2", 
      type: "like",
      user: { name: "Mike Chen", avatar: "/placeholder.svg" },
      action: "liked your post about community gardening",
      timestamp: "5 min ago",
      isNew: true
    },
    {
      id: "3",
      type: "comment",
      user: { name: "Emma Wilson", avatar: "/placeholder.svg" },
      action: "commented on your volunteer opportunity post",
      timestamp: "12 min ago", 
      isNew: false
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new activities
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: "like",
          user: { name: "New User", avatar: "/placeholder.svg" },
          action: "liked your recent post",
          timestamp: "now",
          isNew: true
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like": return Heart;
      case "comment": return MessageCircle;
      case "connection": return UserPlus;
      case "share": return Share2;
      case "post": return Activity;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "like": return "text-red-500";
      case "comment": return "text-blue-500";
      case "connection": return "text-green-500";
      case "share": return "text-purple-500";
      case "post": return "text-orange-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Activity className="h-5 w-5 text-green-500" />
          <span>Live Activity</span>
          <Badge variant="destructive" className="text-xs animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div 
              key={activity.id} 
              className={`p-3 border rounded-lg transition-all ${
                activity.isNew ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <IconComponent className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
                    {activity.isNew && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(activity.id)}
                      className="text-xs h-6"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RealTimeActivityFeed;
