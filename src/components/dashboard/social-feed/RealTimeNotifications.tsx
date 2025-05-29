
import { useState, useEffect } from "react";
import { Bell, X, Check, Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "like" | "comment" | "share" | "follow" | "post" | "help_request";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
  postId?: string;
}

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      title: "New Like",
      message: "Sarah Chen liked your post about moving help",
      timestamp: "2 minutes ago",
      isRead: false,
      avatar: "",
      postId: "post1"
    },
    {
      id: "2",
      type: "comment",
      title: "New Comment",
      message: "Mike Johnson commented on your tutoring offer",
      timestamp: "5 minutes ago",
      isRead: false,
      avatar: "",
      postId: "post2"
    },
    {
      id: "3",
      type: "help_request",
      title: "Urgent Help Needed",
      message: "New urgent help request in your area",
      timestamp: "10 minutes ago",
      isRead: true,
      avatar: "",
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance every 10 seconds
        const types: Notification["type"][] = ["like", "comment", "share", "follow", "help_request"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: getNotificationTitle(randomType),
          message: getNotificationMessage(randomType),
          timestamp: "Just now",
          isRead: false,
          avatar: "",
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 notifications
        
        // Show toast for important notifications
        if (randomType === "help_request") {
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const getNotificationTitle = (type: Notification["type"]) => {
    switch (type) {
      case "like": return "New Like";
      case "comment": return "New Comment";
      case "share": return "Post Shared";
      case "follow": return "New Follower";
      case "help_request": return "Help Needed";
      default: return "New Activity";
    }
  };

  const getNotificationMessage = (type: Notification["type"]) => {
    const names = ["Alex", "Sarah", "Mike", "Lisa", "David"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    switch (type) {
      case "like": return `${randomName} liked your post`;
      case "comment": return `${randomName} commented on your post`;
      case "share": return `${randomName} shared your post`;
      case "follow": return `${randomName} started following you`;
      case "help_request": return "Someone needs urgent help in your area";
      default: return "New activity on your account";
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like": return <Heart className="h-4 w-4 text-red-500" />;
      case "comment": return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "share": return <Share2 className="h-4 w-4 text-green-500" />;
      case "follow": return <UserPlus className="h-4 w-4 text-purple-500" />;
      case "help_request": return <Bell className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                    notification.isRead ? "border-l-transparent" : "border-l-blue-500 bg-blue-50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm ${notification.isRead ? "text-gray-700" : "font-medium text-gray-900"}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="border-t p-3">
            <Button variant="ghost" className="w-full text-sm">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default RealTimeNotifications;
