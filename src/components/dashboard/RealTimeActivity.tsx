
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Users, Heart, MessageSquare } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "new_post" | "help_offered" | "connection_made" | "post_liked" | "comment_added";
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isNew: boolean;
}

const RealTimeActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "new_post",
      user: "Sarah Chen",
      avatar: "",
      content: "posted a new help request: 'Need help moving this weekend'",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isNew: true
    },
    {
      id: "2",
      type: "help_offered",
      user: "Mike Johnson",
      avatar: "",
      content: "offered help with tutoring services",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isNew: true
    },
    {
      id: "3",
      type: "connection_made",
      user: "Emily Rodriguez",
      avatar: "",
      content: "connected with David Kim",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isNew: false
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ["new_post", "help_offered", "connection_made", "post_liked", "comment_added"][Math.floor(Math.random() * 5)] as any,
        user: ["Alex Martinez", "Lisa Park", "James Wilson", "Maria Santos"][Math.floor(Math.random() * 4)],
        avatar: "",
        content: "just joined the community!",
        timestamp: new Date(),
        isNew: true
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 9)];
        // Mark older items as not new
        setTimeout(() => {
          setActivities(current => 
            current.map(item => 
              item.id === newActivity.id ? { ...item, isNew: false } : item
            )
          );
        }, 3000);
        return updated;
      });
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_post": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "help_offered": return <Users className="h-4 w-4 text-green-500" />;
      case "connection_made": return <Users className="h-4 w-4 text-purple-500" />;
      case "post_liked": return <Heart className="h-4 w-4 text-red-500" />;
      case "comment_added": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Live Activity</span>
          <Badge variant="secondary" className="animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 border-b border-gray-100 transition-all duration-500 ${
                activity.isNew ? 'bg-blue-50 animate-fade-in' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.user}
                    </p>
                    {activity.isNew && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.content}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivity;
