// DEPRECATED: Real-time updates are now handled by centralized RealtimeManager
// This hook is kept for backwards compatibility but does nothing
// The RealtimeProvider in App.tsx handles all subscriptions globally

import { useEffect } from 'react';

export const useRealTimeUpdates = () => {
  useEffect(() => {
    // No-op: Real-time is handled globally by RealtimeProvider
    console.log('[useRealTimeUpdates] Deprecated - using centralized RealtimeManager');
  }, []);
};
