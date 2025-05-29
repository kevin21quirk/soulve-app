
interface PushNotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  async subscribeToPush() {
    if (!this.registration) {
      await this.initialize();
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    const subscription = await this.registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        'your-vapid-public-key-here' // Replace with actual VAPID key
      )
    });

    return subscription;
  }

  async showNotification(config: PushNotificationConfig) {
    const permission = await this.requestPermission();
    if (permission !== 'granted') return;

    if (this.registration) {
      await this.registration.showNotification(config.title, {
        body: config.body,
        icon: config.icon || '/icon-192x192.png',
        badge: config.badge || '/badge-72x72.png',
        tag: config.tag,
        data: config.data,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    } else {
      new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icon-192x192.png',
        tag: config.tag,
        data: config.data
      });
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export const pushNotificationService = new PushNotificationService();
