
import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  type: "donation" | "campaign" | "message" | "social" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    donorName?: string;
    campaignTitle?: string;
    senderName?: string;
    actionType?: string;
  };
}

export const useRealTimeNotifications = () => {
  // Mock notifications data - in real app this would come from WebSocket/API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "donation",
      title: "New Donation Received!",
      message: "Sarah Johnson donated $50 to Community Garden Project",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      metadata: {
        amount: 50,
        donorName: "Sarah Johnson",
        campaignTitle: "Community Garden Project"
      }
    },
    {
      id: "2",
      type: "campaign",
      title: "Campaign Milestone Reached",
      message: "Your campaign has reached 75% of its goal!",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
      metadata: {
        campaignTitle: "Educational Technology for Schools"
      }
    },
    {
      id: "3",
      type: "message",
      title: "New Message",
      message: "You have a new message from Alex Chen",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: true,
      metadata: {
        senderName: "Alex Chen"
      }
    },
    {
      id: "4",
      type: "social",
      title: "Post Interaction",
      message: "Mike Wilson liked your post about environmental action",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: false,
      metadata: {
        senderName: "Mike Wilson",
        actionType: "liked"
      }
    },
    {
      id: "5",
      type: "donation",
      title: "Recurring Donation",
      message: "Monthly donation of $25 processed successfully",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isRead: true,
      metadata: {
        amount: 25,
        donorName: "Anonymous",
        campaignTitle: "Local Food Bank Support"
      }
    }
  ]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Filter notifications by type
  const filterNotifications = useCallback((type: string) => {
    if (type === "all") return notifications;
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["donation", "campaign", "message", "social"][Math.floor(Math.random() * 4)] as any,
          title: "New Activity",
          message: "You have new activity on your account",
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Add new notification (for external use)
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
    addNotification
  };
};
