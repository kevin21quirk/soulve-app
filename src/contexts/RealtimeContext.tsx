import { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { realtimeManager } from '@/services/realtimeManager';

const RealtimeContext = createContext<null>(null);

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      console.log('[RealtimeProvider] Initializing real-time subscriptions for user:', user.id);
      realtimeManager.initialize(queryClient, user.id);

      return () => {
        console.log('[RealtimeProvider] Cleaning up real-time subscriptions');
        realtimeManager.cleanup();
      };
    }
  }, [user?.id, queryClient]);

  return <RealtimeContext.Provider value={null}>{children}</RealtimeContext.Provider>;
};

export const useRealtime = () => {
  return useContext(RealtimeContext);
};
