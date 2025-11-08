
// Service Worker for push notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  // Removed skipWaiting() to prevent forced reloads on tab focus
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  // Removed clients.claim() to prevent forced reloads on tab focus
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from SouLVE',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'default',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'SouLVE Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        // If there's already a window/tab open, focus it
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  // Optional: Track notification dismissals
});
