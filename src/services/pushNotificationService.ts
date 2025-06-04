
interface PushNotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9L4J_oM6UgPqWSDKAVtjQ6Jk5AdNpDYvCE7Wj2Y3QiGfpHg8nAjk'; // Demo key

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

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeToPush() {
    if (!this.registration) {
      await this.initialize();
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    try {
      const subscription = await this.registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async showNotification(config: PushNotificationConfig) {
    const permission = await this.requestPermission();
    if (permission !== 'granted') return;

    if (this.registration) {
      await this.registration.showNotification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        badge: config.badge || '/favicon.ico',
        tag: config.tag,
        data: config.data,
        requireInteraction: config.requireInteraction || false,
        actions: [
          { action: 'view', title: 'View' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    } else {
      new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
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
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  async unsubscribe() {
    if (!this.registration) return;

    const subscription = await this.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  }
}

export const pushNotificationService = new PushNotificationService();
