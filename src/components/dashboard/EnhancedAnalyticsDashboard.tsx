
import React, { useState } from "react";
import ImpactMetricsGrid from "./ImpactMetricsGrid";
import HelpActivityChart from "./HelpActivityChart";
import EngagementChart from "./EngagementChart";
import CategoryPieChart from "./CategoryPieChart";
import CommunityImpactCard from "./CommunityImpactCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { 
  AnalyticsCardSkeleton, 
  ChartSkeleton, 
  PageLoadingSkeleton 
} from "@/components/ui/skeleton-variants";
import { ErrorState } from "@/components/ui/error-states";
import { useIsMobile, PullToRefresh } from "@/components/ui/mobile-optimized";
import { useScreenReader } from "@/hooks/useAccessibility";
import { useRealTimeNotifications } from "@/components/ui/real-time-notifications";

const EnhancedAnalyticsDashboard = React.memo(() => {
  const {
    helpActivityData,
    engagementData,
    categoryData,
    impactMetrics,
    isLoading,
    error,
  } = useAnalyticsData();

  const { announce } = useScreenReader();
  const { addNotification } = useRealTimeNotifications();
  const isMobile = useIsMobile();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      announce("Analytics dashboard refreshed");
      addNotification({
        type: "help",
        title: "Analytics Updated",
        message: "Your analytics dashboard has been refreshed",
      });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Analytics Error"
        message="Failed to load analytics data"
        type="server"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  const content = (
    <div className="space-y-6" role="main" aria-label="Analytics Dashboard">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Impact Analytics</h2>
        <p className="text-gray-600">Track your community contribution and engagement</p>
      </div>

      <div 
        role="region" 
        aria-label="Impact Metrics"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {refreshing ? (
          Array.from({ length: 4 }, (_, i) => <AnalyticsCardSkeleton key={i} />)
        ) : (
          <ImpactMetricsGrid metrics={impactMetrics} />
        )}
      </div>

      <div 
        role="region" 
        aria-label="Analytics Charts"
        className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}
      >
        {refreshing ? (
          Array.from({ length: 4 }, (_, i) => <ChartSkeleton key={i} />)
        ) : (
          <>
            <div className={isMobile ? 'col-span-1' : 'lg:col-span-1'}>
              <HelpActivityChart data={helpActivityData} />
            </div>
            <div className={isMobile ? 'col-span-1' : 'lg:col-span-1'}>
              <EngagementChart data={engagementData} />
            </div>
            <div className={isMobile ? 'col-span-1' : 'lg:col-span-1'}>
              <CategoryPieChart data={categoryData} />
            </div>
            <div className={isMobile ? 'col-span-1' : 'lg:col-span-1'}>
              <CommunityImpactCard />
            </div>
          </>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <PullToRefresh onRefresh={handleRefresh}>
      {content}
    </PullToRefresh>
  ) : (
    content
  );
});

EnhancedAnalyticsDashboard.displayName = "EnhancedAnalyticsDashboard";

export default EnhancedAnalyticsDashboard;
