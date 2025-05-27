
import React from "react";
import ImpactMetricsGrid from "./ImpactMetricsGrid";
import HelpActivityChart from "./HelpActivityChart";
import EngagementChart from "./EngagementChart";
import CategoryPieChart from "./CategoryPieChart";
import CommunityImpactCard from "./CommunityImpactCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const AnalyticsDashboard = React.memo(() => {
  const {
    helpActivityData,
    engagementData,
    categoryData,
    impactMetrics,
  } = useAnalyticsData();

  return (
    <div className="space-y-6">
      <ImpactMetricsGrid metrics={impactMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HelpActivityChart data={helpActivityData} />
        <EngagementChart data={engagementData} />
        <CategoryPieChart data={categoryData} />
        <CommunityImpactCard />
      </div>
    </div>
  );
});

AnalyticsDashboard.displayName = "AnalyticsDashboard";

export default AnalyticsDashboard;
