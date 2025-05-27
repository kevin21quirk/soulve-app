
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Clock, 
  Users, 
  Heart, 
  MessageSquare, 
  UserPlus,
  Share2,
  Bookmark,
  MapPin,
  TrendingUp,
  Filter,
  Eye,
  MoreHorizontal,
  Bell,
  BellOff
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "new_post" | "help_offered" | "connection_made" | "post_liked" | "comment_added" | "share" | "bookmark" | "location_tagged" | "group_joined";
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

const RealTimeActivity = () => {
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
    },
    {
      id: "4",
      type: "post_liked",
      user: "Alex Martinez",
      avatar: "",
      content: "liked your post about community gardening",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      isNew: false,
      priority: "low",
      engagement: { likes: 25, comments: 7, shares: 4 },
      category: "engagement"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveEnabled) return;

    const interval = setInterval(() => {
      const activityTypes = ["new_post", "help_offered", "connection_made", "post_liked", "comment_added", "share", "bookmark", "location_tagged", "group_joined"];
      const users = ["Alex Martinez", "Lisa Park", "James Wilson", "Maria Santos", "David Kim", "Anna Thompson"];
      const contents = [
        "just joined the community!",
        "shared a success story",
        "offered to help with tech support",
        "liked your recent post",
        "commented on community discussion",
        "bookmarked your help offer",
        "tagged location in post",
        "joined the local helpers group"
      ];
      const locations = ["London, UK", "New York, US", "Berlin, DE", "Tokyo, JP", "Sydney, AU"];

      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)] as any,
        user: users[Math.floor(Math.random() * users.length)],
        avatar: "",
        content: contents[Math.floor(Math.random() * contents.length)],
        timestamp: new Date(),
        isNew: true,
        priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as any,
        engagement: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10)
        },
        location: Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
        category: ["social", "help", "network", "engagement"][Math.floor(Math.random() * 4)] as any
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 19)]; // Keep last 20
        // Mark older items as not new
        setTimeout(() => {
          setActivities(current => 
            current.map(item => 
              item.id === newActivity.id ? { ...item, isNew: false } : item
            )
          );
        }, 5000);
        return updated;
      });
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, [isLiveEnabled]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_post": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "help_offered": return <Users className="h-4 w-4 text-green-500" />;
      case "connection_made": return <UserPlus className="h-4 w-4 text-purple-500" />;
      case "post_liked": return <Heart className="h-4 w-4 text-red-500" />;
      case "comment_added": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case "share": return <Share2 className="h-4 w-4 text-blue-600" />;
      case "bookmark": return <Bookmark className="h-4 w-4 text-yellow-500" />;
      case "location_tagged": return <MapPin className="h-4 w-4 text-green-600" />;
      case "group_joined": return <Users className="h-4 w-4 text-indigo-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "help": return "bg-blue-100 text-blue-800";
      case "network": return "bg-purple-100 text-purple-800";
      case "engagement": return "bg-green-100 text-green-800";
      case "social": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
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

  const getFilteredActivities = () => {
    if (activeTab === "all") return activities;
    return activities.filter(activity => activity.category === activeTab);
  };

  const getTabCount = (category: string) => {
    if (category === "all") return activities.length;
    return activities.filter(activity => activity.category === category).length;
  };

  return (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Activity</span>
            <Badge 
              variant="secondary" 
              className={`animate-pulse ${isLiveEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
            >
              {isLiveEnabled ? 'LIVE' : 'PAUSED'}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiveEnabled(!isLiveEnabled)}
              className="h-8 w-8 p-0"
            >
              {isLiveEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-8">
            <TabsTrigger value="all" className="text-xs">
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="help" className="text-xs">
              Help ({getTabCount("help")})
            </TabsTrigger>
            <TabsTrigger value="network" className="text-xs">
              Network ({getTabCount("network")})
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs">
              Social ({getTabCount("engagement")})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {getFilteredActivities().map((activity) => (
            <div
              key={activity.id}
              className={`p-3 border-b border-gray-100 border-l-4 transition-all duration-500 hover:bg-gray-50 ${
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
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(activity.category)}`}>
                        {activity.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
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
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
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
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-3 w-3" />
                          <span>{activity.engagement.shares}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {getFilteredActivities().length === 0 && (
            <div className="p-6 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity in this category yet</p>
              <p className="text-xs text-gray-500 mt-1">Check back later for updates</p>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {formatTimeAgo(new Date())}</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>{activities.filter(a => a.isNew).length} new</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivity;
