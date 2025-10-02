import { supabase } from '@/integrations/supabase/client';
import { notificationStorage, CachedNotification } from './notificationStorage';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

export class SyncQueue {
  private isProcessing = false;
  private listeners: Set<() => void> = new Set();

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  async addToQueue(notificationData: any): Promise<string> {
    const notification: CachedNotification = {
      id: crypto.randomUUID(),
      data: notificationData,
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0,
    };

    await notificationStorage.saveNotification(notification);
    this.notify();
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }

    return notification.id;
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine) return;

    this.isProcessing = true;

    try {
      const pendingNotifications = await notificationStorage.getNotificationsByStatus('pending');
      
      for (const notification of pendingNotifications) {
        try {
          await this.syncNotification(notification);
        } catch (error) {
          console.error('Failed to sync notification:', error);
          
          if (notification.retryCount < MAX_RETRY_ATTEMPTS) {
            await notificationStorage.updateNotificationStatus(
              notification.id,
              'pending',
              notification.retryCount + 1
            );
          } else {
            await notificationStorage.updateNotificationStatus(
              notification.id,
              'failed'
            );
          }
        }
      }
    } finally {
      this.isProcessing = false;
      this.notify();
    }
  }

  private async syncNotification(notification: CachedNotification): Promise<void> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification.data)
      .select()
      .single();

    if (error) throw error;

    await notificationStorage.updateNotificationStatus(notification.id, 'synced');
  }

  async retryFailed(): Promise<void> {
    const failedNotifications = await notificationStorage.getNotificationsByStatus('failed');
    
    for (const notification of failedNotifications) {
      await notificationStorage.updateNotificationStatus(
        notification.id,
        'pending',
        0 // Reset retry count
      );
    }

    this.notify();
    await this.processQueue();
  }

  async getPendingCount(): Promise<number> {
    const pending = await notificationStorage.getNotificationsByStatus('pending');
    return pending.length;
  }

  async getFailedCount(): Promise<number> {
    const failed = await notificationStorage.getNotificationsByStatus('failed');
    return failed.length;
  }

  async clearSynced(): Promise<void> {
    await notificationStorage.clearOldNotifications(7); // Keep last 7 days
    this.notify();
  }
}

export const syncQueue = new SyncQueue();

// Auto-process queue when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncQueue.processQueue();
  });
}
