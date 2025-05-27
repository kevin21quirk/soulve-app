
import { useAnalyticsData as useAnalyticsDataService } from "@/services/dataService";

export const useAnalyticsData = () => {
  const { data, isLoading, error } = useAnalyticsDataService();
  
  if (isLoading) {
    console.log('Loading analytics data...');
  }
  
  if (error) {
    console.error('Analytics data error:', error);
  }

  // Return the data in the expected format, with fallbacks
  return {
    helpActivityData: data?.helpActivityData || [],
    engagementData: data?.engagementData || [],
    categoryData: data?.categoryData || [],
    impactMetrics: data?.impactMetrics || [],
    isLoading,
    error,
  };
};
