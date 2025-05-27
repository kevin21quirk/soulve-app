
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Check, X, Heart, MessageSquare, UserPlus, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "like" | "comment" | "connection" | "help_request" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  userName?: string;
}

const NotificationCenter = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      title: "Post liked",
      description: "Sarah Chen liked your post about helping with moving",
      timestamp: "2 minutes ago",
      read: false,
      avatar: "",
      userName: "Sarah Chen"
    },
    {
      id: "2",
      type: "connection",
      title: "New connection request",
      description: "Mike Johnson wants to connect with you",
      timestamp: "1 hour ago",
      read: false,
      avatar: "",
      userName: "Mike Johnson"
    },
    {
      id: "3",
      type: "comment",
      title: "New comment",
      description: "Alex Rodriguez commented on your tutoring offer",
      timestamp: "3 hours ago",
      read: true,
      avatar: "",
      userName: "Alex Rodriguez"
    },
    {
      id: "4",
      type: "help_request",
      title: "Help needed nearby",
      description: "Someone near you needs help with dog walking",
      timestamp: "5 hours ago",
      read: false
    },
    {
      id: "5",
      type: "achievement",
      title: "Achievement unlocked!",
      description: "You've helped 10 community members - Helper Badge earned!",
      timestamp: "1 day ago",
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="h-4 w-4 text-red-500" />;
      case "comment": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "connection": return <UserPlus className="h-4 w-4 text-green-500" />;
      case "help_request": return <Users className="h-4 w-4 text-orange-500" />;
      case "achievement": return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-96 max-h-96 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="ghost" size="sm">
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback className="text-xs">
                            {notification.userName?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="p-2 rounded-full bg-gray-100">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp}
                        </p>
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
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
