
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  UserPlus,
  MapPin,
  Bookmark,
  Activity,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";

interface ActivityItem {
  id: string;
  type: "new_post" | "help_offered" | "connection_made" | "post_liked" | "comment_added" | "share" | "bookmark";
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isNew: boolean;
  priority: "high" | "medium" | "low";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  location?: string;
  category: "social" | "help" | "network" | "engagement";
}

const MobileActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "new_post",
      user: "Sarah Chen",
      avatar: "",
      content: "posted a new help request: 'Need help moving this weekend'",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isNew: true,
      priority: "high",
      engagement: { likes: 12, comments: 3, shares: 2 },
      location: "London, UK",
      category: "help"
    },
    {
      id: "2",
      type: "help_offered",
      user: "Mike Johnson",
      avatar: "",
      content: "offered help with tutoring services",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isNew: true,
      priority: "high",
      engagement: { likes: 8, comments: 1, shares: 0 },
      category: "help"
    },
    {
      id: "3",
      type: "connection_made",
      user: "Emily Rodriguez",
      avatar: "",
      content: "connected with David Kim",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isNew: false,
      priority: "medium",
      category: "network"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add a new mock activity
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: "post_liked",
      user: "Alex Martinez",
      avatar: "",
      content: "liked your post about community gardening",
      timestamp: new Date(),
      isNew: true,
      priority: "low",
      engagement: { likes: 1, comments: 0, shares: 0 },
      category: "engagement"
    };
    
    setActivities(prev => [newActivity, ...prev]);
    setIsRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_post":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "help_offered":
        return <Users className="h-4 w-4 text-green-500" />;
      case "connection_made":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case "post_liked":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "share":
        return <Share2 className="h-4 w-4 text-blue-600" />;
      case "bookmark":
        return <Bookmark className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "help":
        return "bg-blue-100 text-blue-800";
      case "network":
        return "bg-purple-100 text-purple-800";
      case "engagement":
        return "bg-green-100 text-green-800";
      case "social":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredActivities = activeFilter === "all" 
    ? activities 
    : activities.filter(activity => activity.category === activeFilter);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-gray-700" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Live Activity</h1>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 animate-pulse">
                  LIVE
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                className="p-2"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: "all", label: "All", count: activities.length },
              { id: "help", label: "Help", count: activities.filter(a => a.category === "help").length },
              { id: "network", label: "Network", count: activities.filter(a => a.category === "network").length },
              { id: "engagement", label: "Social", count: activities.filter(a => a.category === "engagement").length }
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center space-x-1 text-xs whitespace-nowrap"
              >
                <span>{filter.label}</span>
                <Badge variant="outline" className="text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="p-4 space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 p-4 ${
                getPriorityColor(activity.priority)
              } ${activity.isNew ? 'animate-fade-in' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  {activity.isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.user}
                    </p>
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.content}
                  </p>
                  
                  {activity.location && (
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                    
                    {activity.engagement && (
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{activity.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{activity.engagement.comments}</span>
                        </div>
                        {activity.engagement.shares > 0 && (
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-3 w-3" />
                            <span>{activity.engagement.shares}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-500">Activity will appear here as it happens</p>
          </div>
        )}
      </div>
    </PullToRefresh>
  );
};

export default MobileActivityFeed;
