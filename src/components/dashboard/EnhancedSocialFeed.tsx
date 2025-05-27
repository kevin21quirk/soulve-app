
import React from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import FeedContainer from "./social-feed/FeedContainer";
import { NetworkStatus } from "@/components/ui/error-states";
import { usePerformanceTracker } from "@/utils/performance";

/**
 * Enhanced Social Feed Component
 * Main entry point for the social feed feature
 * 
 * @component
 * @example
 * return (
 *   <EnhancedSocialFeed />
 * )
 */
const EnhancedSocialFeed = React.memo(() => {
  // Track performance metrics
  usePerformanceTracker('EnhancedSocialFeed');

  return (
    <ErrorBoundary>
      <NetworkStatus />
      <FeedContainer />
    </ErrorBoundary>
  );
});

EnhancedSocialFeed.displayName = "EnhancedSocialFeed";

export default EnhancedSocialFeed;
