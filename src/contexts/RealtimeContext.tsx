import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { realtimeManager } from '@/services/realtimeManager';

const RealtimeContext = createContext<null>(null);

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const initializingRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Skip if already initializing or no user
    if (!user?.id || initializingRef.current) return;

    const initializeRealtime = async () => {
      try {
        initializingRef.current = true;
        console.log('[RealtimeProvider] Initializing real-time subscriptions for user:', user.id);
        realtimeManager.initialize(queryClient, user.id);
        setInitialized(true);
      } catch (error) {
        console.error('[RealtimeProvider] Error initializing real-time:', error);
        // Don't crash the app - real-time is non-critical
        setInitialized(true);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeRealtime();

    return () => {
      try {
        console.log('[RealtimeProvider] Cleaning up real-time subscriptions');
        realtimeManager.cleanup();
        setInitialized(false);
        initializingRef.current = false;
      } catch (error) {
        console.error('[RealtimeProvider] Error during cleanup:', error);
      }
    };
  }, [user?.id, queryClient]);

  // Handle visibility change to prevent reconnection issues
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.id && initialized) {
        // Re-initialize subscriptions when tab becomes visible again
        try {
          console.log('[RealtimeProvider] Tab visible - reinitializing subscriptions');
          realtimeManager.cleanup();
          realtimeManager.initialize(queryClient, user.id);
        } catch (error) {
          console.error('[RealtimeProvider] Error reinitializing on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.id, queryClient, initialized]);

  return <RealtimeContext.Provider value={null}>{children}</RealtimeContext.Provider>;
};

export const useRealtime = () => {
  return useContext(RealtimeContext);
};
