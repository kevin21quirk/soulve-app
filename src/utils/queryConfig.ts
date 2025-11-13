import { QueryClient } from '@tanstack/react-query';

/**
 * Optimized React Query configuration to prevent excessive refetching
 * 
 * Key optimizations:
 * - Longer staleTime: Data stays fresh for 5 minutes before being considered stale
 * - refetchOnWindowFocus: false - Don't refetch when user switches back to tab
 * - refetchOnReconnect: false - Don't refetch when internet reconnects
 * - refetchOnMount: false - Don't refetch when component remounts
 * - Real-time updates handled by centralized RealtimeManager
 */
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        
        // Don't refetch on window focus
        refetchOnWindowFocus: false,
        
        // Don't refetch on reconnect
        refetchOnReconnect: false,
        
        // Only fetch once on mount unless data is stale
        refetchOnMount: false,
        
        // Retry failed requests 1 time (down from default 3)
        retry: 1,
        
        // Show stale data while refetching in background
        refetchInterval: false,
      },
      mutations: {
        // Retry failed mutations 1 time
        retry: 1,
      },
    },
  });
};

