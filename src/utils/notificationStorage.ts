// IndexedDB wrapper for offline notification storage
const DB_NAME = 'notificationsDB';
const STORE_NAME = 'notifications';
const DB_VERSION = 1;

export interface CachedNotification {
  id: string;
  data: any;
  timestamp: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  retryCount: number;
}

class NotificationStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveNotification(notification: CachedNotification): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(notification);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getNotification(id: string): Promise<CachedNotification | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAllNotifications(): Promise<CachedNotification[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getNotificationsByStatus(status: 'pending' | 'synced' | 'failed'): Promise<CachedNotification[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('syncStatus');
      const request = index.getAll(status);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async updateNotificationStatus(id: string, status: 'pending' | 'synced' | 'failed', retryCount?: number): Promise<void> {
    if (!this.db) await this.init();

    const notification = await this.getNotification(id);
    if (!notification) return;

    notification.syncStatus = status;
    if (retryCount !== undefined) {
      notification.retryCount = retryCount;
    }

    await this.saveNotification(notification);
  }

  async deleteNotification(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearOldNotifications(daysToKeep: number = 30): Promise<void> {
    if (!this.db) await this.init();

    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const allNotifications = await this.getAllNotifications();

    const deletePromises = allNotifications
      .filter(n => n.timestamp < cutoffTime && n.syncStatus === 'synced')
      .map(n => this.deleteNotification(n.id));

    await Promise.all(deletePromises);
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getStorageSize(): Promise<string> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usageInMB = (estimate.usage || 0) / (1024 * 1024);
      return `${usageInMB.toFixed(2)} MB`;
    }
    return 'Unknown';
  }
}

export const notificationStorage = new NotificationStorage();
