import { QueryClient } from '@tanstack/react-query';

/**
 * Optimized React Query configuration for instant page loads
 * 
 * Key optimizations:
 * - staleTime: 0 with placeholderData = Show cached data instantly, refetch in background
 * - gcTime: 30 minutes - Keep data in cache longer for instant navigation
 * - refetchOnWindowFocus: false - Don't refetch when user switches back to tab
 * - Real-time updates handled by centralized RealtimeManager
 */
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // STALE-WHILE-REVALIDATE: Show cached data immediately
        staleTime: 0,
        
        // Keep unused data in cache for 30 minutes for instant navigation
        gcTime: 30 * 60 * 1000,
        
        // Don't refetch on window focus - prevents unwanted reloads
        refetchOnWindowFocus: false,
        
        // Don't refetch on reconnect
        refetchOnReconnect: false,
        
        // Show stale cached data on mount, refetch in background
        refetchOnMount: true,
        
        // Retry failed requests 1 time
        retry: 1,
        
        // No polling - real-time handles updates
        refetchInterval: false,
        
        // Keep previous data while fetching new data
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

