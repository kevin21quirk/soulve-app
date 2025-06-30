
import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const MobileOptimizations = ({ children }: { children: React.ReactNode }) => {
  const { isOnline } = usePWA();
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  useEffect(() => {
    // Add viewport meta tag if not present
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover');

    // Add theme color meta tag
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#0ce4af');

    // Add apple mobile web app capable
    let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobile) {
      appleMobile = document.createElement('meta');
      appleMobile.setAttribute('name', 'apple-mobile-web-app-capable');
      appleMobile.setAttribute('content', 'yes');
      document.head.appendChild(appleMobile);
    }

    // Prevent zoom on form inputs
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true);
      const timer = setTimeout(() => setShowOfflineNotice(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <div className="relative">
      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm z-50 animate-slide-down">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Some features may not work.</span>
          </div>
        </div>
      )}

      {/* Online Notice */}
      {isOnline && showOfflineNotice && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-2 text-center text-sm z-50 animate-slide-down">
          <div className="flex items-center justify-center space-x-2">
            <Wifi className="h-4 w-4" />
            <span>Back online!</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default MobileOptimizations;
