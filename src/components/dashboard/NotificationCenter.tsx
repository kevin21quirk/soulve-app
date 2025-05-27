import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import NotificationHeader from "./notifications/NotificationHeader";
import NotificationFilters from "./notifications/NotificationFilters";
import NotificationTabs from "./notifications/NotificationTabs";
import NotificationItem from "./notifications/NotificationItem";
import NotificationStats from "./notifications/NotificationStats";
import EmptyNotifications from "./notifications/EmptyNotifications";

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
        <NotificationHeader
          unreadCount={unreadCount}
          highPriorityCount={highPriorityCount}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onMarkAllAsRead={markAllAsRead}
        />

        {showFilters && (
          <NotificationFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getTabCount}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDismiss={dismissNotification}
                  onAction={handleNotificationAction}
                />
              ))}
            </div>
          )}
        </div>

        <NotificationStats unreadCount={unreadCount} />
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
