
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Check, 
  X, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Users, 
  Star,
  Filter,
  Settings,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "like" | "comment" | "connection" | "help_request" | "achievement" | "mention" | "share" | "follow" | "group_invite" | "event" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  avatar?: string;
  userName?: string;
  groupId?: string;
  actionRequired?: boolean;
  metadata?: {
    postId?: string;
    connectionId?: string;
    eventId?: string;
    url?: string;
    previewImage?: string;
  };
}

const NotificationCenter = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "priority" | "unread">("newest");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      title: "Post liked",
      description: "Sarah Chen and 12 others liked your post about helping with moving",
      timestamp: "2 minutes ago",
      read: false,
      priority: "medium",
      avatar: "",
      userName: "Sarah Chen",
      metadata: { postId: "post_123" }
    },
    {
      id: "2",
      type: "connection",
      title: "New connection request",
      description: "Mike Johnson wants to connect with you",
      timestamp: "1 hour ago",
      read: false,
      priority: "high",
      avatar: "",
      userName: "Mike Johnson",
      actionRequired: true,
      metadata: { connectionId: "conn_456" }
    },
    {
      id: "3",
      type: "mention",
      title: "You were mentioned",
      description: "Alex Rodriguez mentioned you in a comment about tutoring",
      timestamp: "3 hours ago",
      read: false,
      priority: "high",
      avatar: "",
      userName: "Alex Rodriguez",
      metadata: { postId: "post_789" }
    },
    {
      id: "4",
      type: "group_invite",
      title: "Group invitation",
      description: "You've been invited to join 'Local Tech Helpers' group",
      timestamp: "5 hours ago",
      read: false,
      priority: "medium",
      actionRequired: true,
      groupId: "group_123"
    },
    {
      id: "5",
      type: "achievement",
      title: "Achievement unlocked!",
      description: "You've helped 10 community members - Helper Badge earned!",
      timestamp: "1 day ago",
      read: true,
      priority: "low"
    },
    {
      id: "6",
      type: "event",
      title: "Upcoming event",
      description: "Community cleanup event starts in 2 hours",
      timestamp: "2 hours ago",
      read: false,
      priority: "high",
      metadata: { eventId: "event_456" }
    },
    {
      id: "7",
      type: "share",
      title: "Post shared",
      description: "Your moving help post was shared by Lisa Park",
      timestamp: "4 hours ago",
      read: true,
      priority: "low",
      avatar: "",
      userName: "Lisa Park"
    }
  ]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === "high" ? "text-red-500" : priority === "medium" ? "text-orange-500" : "text-gray-500";
    
    switch (type) {
      case "like": return <Heart className={`h-4 w-4 ${iconClass}`} />;
      case "comment": return <MessageSquare className={`h-4 w-4 ${iconClass}`} />;
      case "connection": return <UserPlus className={`h-4 w-4 ${iconClass}`} />;
      case "help_request": return <Users className={`h-4 w-4 ${iconClass}`} />;
      case "achievement": return <Star className="h-4 w-4 text-yellow-500" />;
      case "mention": return <Bell className={`h-4 w-4 ${iconClass}`} />;
      case "share": return <Share2 className={`h-4 w-4 ${iconClass}`} />;
      case "follow": return <UserPlus className={`h-4 w-4 ${iconClass}`} />;
      case "group_invite": return <Users className={`h-4 w-4 ${iconClass}`} />;
      case "event": return <Calendar className={`h-4 w-4 ${iconClass}`} />;
      case "system": return <AlertCircle className={`h-4 w-4 ${iconClass}`} />;
      default: return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />;
      case "medium": return <Badge className="h-2 w-2 p-0 rounded-full bg-orange-500" />;
      case "low": return <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />;
      default: return null;
    }
  };

  const getNotificationBackground = (notification: Notification) => {
    if (!notification.read) {
      switch (notification.priority) {
        case "high": return "bg-red-50 border-l-4 border-l-red-500";
        case "medium": return "bg-orange-50 border-l-4 border-l-orange-500";
        default: return "bg-blue-50 border-l-4 border-l-blue-500";
      }
    }
    return "bg-white hover:bg-gray-50";
  };

  const groupedNotifications = useMemo(() => {
    const grouped = notifications.reduce((acc, notification) => {
      const key = `${notification.type}_${notification.userName || 'system'}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    return Object.values(grouped).map(group => {
      if (group.length === 1) return group[0];
      
      const latest = group[0];
      const count = group.length;
      return {
        ...latest,
        id: `group_${latest.type}_${latest.userName}`,
        description: `${latest.description.split(' ')[0]} and ${count - 1} others ${latest.description.split(' ').slice(1).join(' ')}`,
        groupId: `group_${latest.type}_${latest.userName}`,
        metadata: { ...latest.metadata, groupCount: count }
      };
    });
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = activeTab === "all" ? groupedNotifications : 
      groupedNotifications.filter(notification => {
        switch (activeTab) {
          case "social": return ["like", "comment", "share", "follow", "mention"].includes(notification.type);
          case "connections": return ["connection", "group_invite"].includes(notification.type);
          case "activities": return ["help_request", "event", "achievement"].includes(notification.type);
          case "unread": return !notification.read;
          default: return true;
        }
      });

    // Sort notifications
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "unread":
          return Number(!a.read) - Number(!b.read);
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  }, [groupedNotifications, activeTab, sortBy]);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all": return notifications.length;
      case "social": return notifications.filter(n => ["like", "comment", "share", "follow", "mention"].includes(n.type)).length;
      case "connections": return notifications.filter(n => ["connection", "group_invite"].includes(n.type)).length;
      case "activities": return notifications.filter(n => ["help_request", "event", "achievement"].includes(n.type)).length;
      case "unread": return notifications.filter(n => !n.read).length;
      default: return 0;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification center is now up to date.",
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed.",
    });
  };

  const handleNotificationAction = (notification: Notification, action: "accept" | "decline" | "view") => {
    switch (action) {
      case "accept":
        toast({
          title: "Action completed",
          description: `${notification.type === "connection" ? "Connection accepted" : "Invitation accepted"}`,
        });
        markAsRead(notification.id);
        break;
      case "decline":
        dismissNotification(notification.id);
        break;
      case "view":
        markAsRead(notification.id);
        toast({
          title: "Opening content",
          description: "Navigating to the requested content...",
        });
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === "high").length;

  return (
    <Card className="w-96 max-h-[600px] overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
            {highPriorityCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2">
                {highPriorityCount} urgent
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="ghost" size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center space-x-2 pt-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="newest">Newest first</option>
              <option value="priority">Priority</option>
              <option value="unread">Unread first</option>
            </select>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-8">
            <TabsTrigger value="all" className="text-xs">
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs">
              Social ({getTabCount("social")})
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-xs">
              Network ({getTabCount("connections")})
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs">
              Events ({getTabCount("activities")})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({getTabCount("unread")})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications in this category</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 transition-all duration-200 ${getNotificationBackground(notification)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="relative">
                        {notification.avatar || notification.userName ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="text-xs">
                              {notification.userName?.split(' ').map(n => n[0]).join('') || 'SY'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="p-2 rounded-full bg-gray-100">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        {!notification.read && (
                          <div className="absolute -top-1 -left-1">
                            {getPriorityBadge(notification.priority)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{notification.timestamp}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.description}
                        </p>

                        {notification.actionRequired && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleNotificationAction(notification, "accept")}
                              className="h-7 px-3 text-xs"
                            >
                              {notification.type === "connection" ? "Accept" : "Join"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNotificationAction(notification, "decline")}
                              className="h-7 px-3 text-xs"
                            >
                              {notification.type === "connection" ? "Decline" : "Ignore"}
                            </Button>
                          </div>
                        )}

                        {!notification.actionRequired && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNotificationAction(notification, "view")}
                            className="h-6 px-2 text-xs mt-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => dismissNotification(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </span>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                View All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
