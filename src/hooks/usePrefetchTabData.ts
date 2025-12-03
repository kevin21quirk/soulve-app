import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/services/queryKeys';

/**
 * Hook for prefetching tab data on hover
 * Warms up React Query cache before user clicks
 */
export const usePrefetchTabData = () => {
  const queryClient = useQueryClient();
  const prefetchedTabs = useRef(new Set<string>());

  const prefetchTabData = useCallback((tabValue: string) => {
    // Skip if already prefetched
    if (prefetchedTabs.current.has(tabValue)) return;
    prefetchedTabs.current.add(tabValue);

    // Prefetch data based on tab
    switch (tabValue) {
      case 'feed':
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.FEED_POSTS,
          staleTime: 5 * 60 * 1000,
        });
        break;
      case 'discover-connect':
        queryClient.prefetchQuery({
          queryKey: ['connections'],
          staleTime: 5 * 60 * 1000,
        });
        queryClient.prefetchQuery({
          queryKey: ['suggested-connections'],
          staleTime: 5 * 60 * 1000,
        });
        break;
      case 'messaging':
        queryClient.prefetchQuery({
          queryKey: ['conversations'],
          staleTime: 2 * 60 * 1000,
        });
        break;
      case 'campaigns':
        queryClient.prefetchQuery({
          queryKey: ['campaigns'],
          staleTime: 5 * 60 * 1000,
        });
        break;
      case 'organisation-tools':
        queryClient.prefetchQuery({
          queryKey: ['organizations'],
          staleTime: 5 * 60 * 1000,
        });
        break;
      case 'impact-analytics':
        queryClient.prefetchQuery({
          queryKey: ['impact-stats'],
          staleTime: 5 * 60 * 1000,
        });
        break;
      case 'profile':
        queryClient.prefetchQuery({
          queryKey: ['user-profile'],
          staleTime: 5 * 60 * 1000,
        });
        break;
    }
  }, [queryClient]);

  // Create hover handlers with delay
  const createHoverHandlers = useCallback((tabValue: string, delay = 150) => {
    let timeoutId: number;
    
    return {
      onMouseEnter: () => {
        timeoutId = window.setTimeout(() => {
          prefetchTabData(tabValue);
        }, delay);
      },
      onMouseLeave: () => {
        if (timeoutId) clearTimeout(timeoutId);
      },
    };
  }, [prefetchTabData]);

  return { prefetchTabData, createHoverHandlers };
};

/**
 * Preload tab component bundles during idle time
 */
export const preloadTabBundles = () => {
  const tabImports = [
    () => import('@/components/dashboard/tabs/FeedTab'),
    () => import('@/components/dashboard/tabs/DiscoverTab'),
    () => import('@/components/dashboard/tabs/MessagingTab'),
    () => import('@/components/dashboard/tabs/CampaignsTab'),
    () => import('@/components/dashboard/tabs/DiscoverConnectTab'),
    () => import('@/components/dashboard/tabs/CombinedImpactAnalyticsTab'),
    () => import('@/components/dashboard/tabs/EnhancedHelpCenterTab'),
    () => import('@/components/dashboard/tabs/ProfileTab'),
  ];

  // Use requestIdleCallback to load during idle time
  if ('requestIdleCallback' in window) {
    tabImports.forEach((importFn, index) => {
      requestIdleCallback(() => {
        importFn().catch(() => {
          // Silently fail - this is just preloading
        });
      }, { timeout: 1000 + (index * 200) }); // Stagger loads
    });
  } else {
    // Fallback for Safari
    tabImports.forEach((importFn, index) => {
      setTimeout(() => {
        importFn().catch(() => {});
      }, 100 + (index * 200));
    });
  }
};

/**
 * Eagerly prefetch critical tab data on dashboard load
 */
export const prefetchCriticalData = (queryClient: ReturnType<typeof useQueryClient>) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch feed data (most visited)
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.FEED_POSTS,
        staleTime: 5 * 60 * 1000,
      });
      
      // Prefetch conversations (frequently accessed)
      queryClient.prefetchQuery({
        queryKey: ['conversations'],
        staleTime: 2 * 60 * 1000,
      });
    }, { timeout: 2000 });
  }
};
