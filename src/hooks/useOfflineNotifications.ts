
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface OfflineNotification {
  id: string;
  type: "donation" | "campaign" | "message" | "social" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: any;
  syncStatus: "pending" | "synced" | "failed";
}

interface OfflineNotificationState {
  notifications: OfflineNotification[];
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingSyncCount: number;
}

export const useOfflineNotifications = () => {
  const { toast } = useToast();
  const [state, setState] = useState<OfflineNotificationState>({
    notifications: [],
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingSyncCount: 0
  });

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('offline-notifications');
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          notifications: parsedNotifications,
          pendingSyncCount: parsedNotifications.filter((n: OfflineNotification) => 
            n.syncStatus === 'pending'
          ).length
        }));
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Connection restored",
        description: "Syncing offline notifications...",
      });
      syncOfflineNotifications();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "You're offline",
        description: "Notifications will be cached locally",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('offline-notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  const addNotification = (notification: Omit<OfflineNotification, 'id' | 'timestamp' | 'syncStatus'>) => {
    const newNotification: OfflineNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      syncStatus: state.isOnline ? 'synced' : 'pending'
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications.slice(0, 99)], // Keep last 100
      pendingSyncCount: state.isOnline ? prev.pendingSyncCount : prev.pendingSyncCount + 1
    }));

    // If online, immediately try to sync
    if (state.isOnline) {
      syncNotification(newNotification);
    }

    return newNotification;
  };

  const markAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === id
          ? { 
              ...notification, 
              isRead: true,
              syncStatus: state.isOnline && notification.syncStatus === 'synced' ? 'synced' : 'pending'
            }
          : notification
      ),
      pendingSyncCount: state.isOnline ? prev.pendingSyncCount : prev.pendingSyncCount + 1
    }));
  };

  const deleteNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(notification => notification.id !== id)
    }));
  };

  const syncNotification = async (notification: OfflineNotification) => {
    try {
      // Simulate API call to sync notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notification.id ? { ...n, syncStatus: 'synced' } : n
        ),
        pendingSyncCount: Math.max(0, prev.pendingSyncCount - 1)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notification.id ? { ...n, syncStatus: 'failed' } : n
        )
      }));
    }
  };

  const syncOfflineNotifications = async () => {
    const pendingNotifications = state.notifications.filter(n => n.syncStatus === 'pending');
    
    if (pendingNotifications.length === 0) {
      setState(prev => ({ ...prev, lastSyncTime: new Date() }));
      return;
    }

    try {
      // Sync all pending notifications
      await Promise.all(pendingNotifications.map(notification => syncNotification(notification)));
      
      setState(prev => ({ 
        ...prev, 
        lastSyncTime: new Date(),
        pendingSyncCount: 0
      }));

      toast({
        title: "Sync completed",
        description: `${pendingNotifications.length} notifications synced`,
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Some notifications couldn't be synced",
        variant: "destructive"
      });
    }
  };

  const retryFailedSync = async () => {
    const failedNotifications = state.notifications.filter(n => n.syncStatus === 'failed');
    
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.syncStatus === 'failed' ? { ...n, syncStatus: 'pending' } : n
      ),
      pendingSyncCount: prev.pendingSyncCount + failedNotifications.length
    }));

    if (state.isOnline) {
      await syncOfflineNotifications();
    }
  };

  const clearCache = () => {
    setState({
      notifications: [],
      isOnline: navigator.onLine,
      lastSyncTime: null,
      pendingSyncCount: 0
    });
    localStorage.removeItem('offline-notifications');
  };

  const getStorageSize = () => {
    const stored = localStorage.getItem('offline-notifications');
    return stored ? new Blob([stored]).size : 0;
  };

  const getStorageSizeFormatted = () => {
    const bytes = getStorageSize();
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return {
    ...state,
    addNotification,
    markAsRead,
    deleteNotification,
    syncOfflineNotifications,
    retryFailedSync,
    clearCache,
    getStorageSize: getStorageSizeFormatted,
    unreadCount: state.notifications.filter(n => !n.isRead).length
  };
};
