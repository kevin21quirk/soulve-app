import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificationStorage, CachedNotification } from '@/utils/notificationStorage';
import { syncQueue } from '@/utils/syncQueue';

export const useOfflineNotifications = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState<CachedNotification[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Initialize storage
  useEffect(() => {
    notificationStorage.init().catch(console.error);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const allNotifications = await notificationStorage.getAllNotifications();
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  const updatePendingCount = useCallback(async () => {
    const count = await syncQueue.getPendingCount();
    setPendingSyncCount(count);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Back online',
        description: 'Syncing offline notifications...',
      });
      syncQueue.processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You are offline',
        description: 'Notifications will be cached locally',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Subscribe to sync queue changes
  useEffect(() => {
    const unsubscribe = syncQueue.subscribe(() => {
      loadNotifications();
      updatePendingCount();
    });

    return () => {
      unsubscribe();
    };
  }, [loadNotifications, updatePendingCount]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    updatePendingCount();
  }, [loadNotifications, updatePendingCount]);

  const cacheNotification = useCallback(async (notificationData: any) => {
    try {
      await syncQueue.addToQueue(notificationData);
      await loadNotifications();
      await updatePendingCount();
    } catch (error) {
      console.error('Failed to cache notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification',
        variant: 'destructive',
      });
    }
  }, [loadNotifications, updatePendingCount, toast]);

  const syncOfflineNotifications = useCallback(async () => {
    if (!isOnline) {
      toast({
        title: 'Offline',
        description: 'Cannot sync while offline',
        variant: 'destructive',
      });
      return;
    }

    try {
      await syncQueue.processQueue();
      setLastSyncTime(new Date());
      toast({
        title: 'Sync complete',
        description: 'All notifications have been synced',
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: 'Sync failed',
        description: 'Some notifications could not be synced',
        variant: 'destructive',
      });
    }
  }, [isOnline, toast]);

  const retryFailedSync = useCallback(async () => {
    try {
      await syncQueue.retryFailed();
      toast({
        title: 'Retry initiated',
        description: 'Attempting to sync failed notifications',
      });
    } catch (error) {
      console.error('Retry failed:', error);
      toast({
        title: 'Retry failed',
        description: 'Could not retry failed notifications',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const clearCache = useCallback(async () => {
    try {
      await notificationStorage.clearAll();
      await loadNotifications();
      await updatePendingCount();
      toast({
        title: 'Cache cleared',
        description: 'All cached notifications have been removed',
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive',
      });
    }
  }, [loadNotifications, updatePendingCount, toast]);

  const [storageSize, setStorageSize] = useState<string>('0 B');

  // Update storage size periodically
  useEffect(() => {
    const updateSize = async () => {
      const size = await notificationStorage.getStorageSize();
      setStorageSize(size);
    };
    
    updateSize();
    const interval = setInterval(updateSize, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [notifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const notification = await notificationStorage.getNotification(id);
      if (notification && notification.data) {
        notification.data.is_read = true;
        await notificationStorage.saveNotification(notification);
        await loadNotifications();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [loadNotifications]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationStorage.deleteNotification(id);
      await loadNotifications();
      await updatePendingCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [loadNotifications, updatePendingCount]);

  const getStorageSize = useCallback(() => storageSize, [storageSize]);

  const unreadCount = notifications.filter(n => n.data?.is_read === false).length;

  return {
    isOnline,
    notifications,
    pendingSyncCount,
    lastSyncTime,
    cacheNotification,
    syncOfflineNotifications,
    retryFailedSync,
    clearCache,
    getStorageSize,
    markAsRead,
    deleteNotification,
    unreadCount,
  };
};
