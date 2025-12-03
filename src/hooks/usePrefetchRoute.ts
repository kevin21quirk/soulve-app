import { useEffect, useRef } from 'react';

/**
 * Route prefetching utilities for optimal navigation performance
 * Prefetches route bundles during idle time to make navigation instant
 */

// Cache to track which routes have been prefetched
const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route bundle by dynamically importing it
 * Uses requestIdleCallback to avoid blocking main thread
 */
export const prefetchRoute = (routePath: string) => {
  // Skip if already prefetched
  if (prefetchedRoutes.has(routePath)) {
    return;
  }

  // Wait for browser idle time
  requestIdleCallback(() => {
    try {
      // Map route paths to their component files
      const routeMap: Record<string, () => Promise<any>> = {
        // Core authenticated routes
        '/dashboard': () => import('@/pages/Dashboard'),
        '/auth': () => import('@/pages/Auth'),
        
        // Public pages
        '/about': () => import('@/pages/About'),
        '/how-it-works': () => import('@/pages/HowItWorks'),
        '/faq': () => import('@/pages/FAQ'),
        '/terms-of-service': () => import('@/pages/TermsOfService'),
        '/privacy-policy': () => import('@/pages/PrivacyPolicy'),
        '/cookie-policy': () => import('@/pages/CookiePolicy'),
        '/esg': () => import('@/pages/ESG'),
        '/careers': () => import('@/pages/Careers'),
        '/press': () => import('@/pages/Press'),
        '/team': () => import('@/pages/Team'),
        '/blog': () => import('@/pages/Blog'),
        '/discover': () => import('@/pages/Discover'),
        '/groups': () => import('@/pages/Groups'),
        '/campaigns': () => import('@/pages/CampaignDiscovery'),
        '/events': () => import('@/pages/Events'),
        '/stories': () => import('@/pages/ImpactStories'),
        '/helpers': () => import('@/pages/Helpers'),
        '/help-center': () => import('@/pages/HelpCentre'),
        '/guidelines': () => import('@/pages/Guidelines'),
        '/trust-safety': () => import('@/pages/TrustSafety'),
        '/impact': () => import('@/pages/Impact'),
        '/api': () => import('@/pages/DeveloperAPI'),
        '/report': () => import('@/pages/ReportIssue'),
        '/accessibility': () => import('@/pages/Accessibility'),
        '/volunteer': () => import('@/pages/Volunteer'),
        '/partner': () => import('@/pages/Partner'),
        '/newsletter': () => import('@/pages/Newsletter'),
        '/resources': () => import('@/pages/Resources'),
        '/mobile-app': () => import('@/pages/MobileApp'),
        '/pricing': () => import('@/pages/Pricing'),
        '/features': () => import('@/pages/Features'),
        '/enterprise': () => import('@/pages/Enterprise'),
        '/security': () => import('@/pages/Security'),
        '/status': () => import('@/pages/SystemStatus'),
        '/for-charities': () => import('@/pages/ForCharities'),
        '/for-volunteers': () => import('@/pages/ForVolunteers'),
        '/for-businesses': () => import('@/pages/ForBusinesses'),
        '/for-donors': () => import('@/pages/ForDonors'),
        '/for-philanthropists': () => import('@/pages/ForPhilanthropists'),
        '/for-governance': () => import('@/pages/ForGovernance'),
        '/for-public': () => import('@/pages/ForPublic'),
        '/for-community-groups': () => import('@/pages/ForCommunityGroups'),
      };

      const importFn = routeMap[routePath];
      if (importFn) {
        importFn().then(() => {
          prefetchedRoutes.add(routePath);
        });
      }
    } catch (error) {
      // Silently fail - prefetching is an optimization, not critical
      console.debug('Prefetch failed for', routePath, error);
    }
  });
};

/**
 * Prefetch multiple routes at once
 */
export const prefetchRoutes = (routes: string[]) => {
  routes.forEach(route => prefetchRoute(route));
};

/**
 * Hook for intersection observer based prefetching
 * Prefetches routes when element enters viewport
 */
export const useIntersectionPrefetch = (routes: string[], rootMargin = '200px') => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Element is visible, start prefetching
          prefetchRoutes(routes);
          observer.disconnect(); // Only prefetch once
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [routes, rootMargin]);

  return ref;
};

/**
 * Hook for hover intent based prefetching
 * Prefetches route when user hovers for 200ms (indicates intent to click)
 */
export const useHoverPrefetch = (routePath: string, delay = 200) => {
  const timeoutRef = useRef<number>();

  const onMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      prefetchRoute(routePath);
    }, delay);
  };

  const onMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return { onMouseEnter, onMouseLeave };
};
