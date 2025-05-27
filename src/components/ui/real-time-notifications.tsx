
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, MessageCircle, Heart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "message" | "like" | "connection" | "help";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: () => void;
}

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10

    // Show toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate real-time notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "message" as const,
          title: "New Message",
          message: "Sarah sent you a message about tutoring help",
        },
        {
          type: "like" as const,
          title: "Post Liked",
          message: "Your moving help post received a new like",
        },
        {
          type: "connection" as const,
          title: "New Connection",
          message: "Mike wants to connect with you",
        },
        {
          type: "help" as const,
          title: "Help Request",
          message: "Someone nearby needs tech support help",
        },
      ];

      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotification);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    unreadCount: notifications.filter(n => !n.read).length,
  };
};

export const NotificationPanel = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onRemove 
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
}) => {
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message": return MessageCircle;
      case "like": return Heart;
      case "connection": return Users;
      case "help": return Bell;
      default: return Bell;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notifications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Mark all read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex items-center space-x-1">
                        {!notification.read && <Badge variant="secondary" className="h-2 w-2 p-0" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onRemove(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 px-2"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
