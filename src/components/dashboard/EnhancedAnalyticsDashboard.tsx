
import React, { useState } from "react";
import PersonalImpactCard from "./analytics/PersonalImpactCard";
import EngagementMetricsCard from "./analytics/EngagementMetricsCard";
import NetworkAnalyticsCard from "./analytics/NetworkAnalyticsCard";
import ComparativeMetricsCard from "./analytics/ComparativeMetricsCard";
import VisualAnalyticsDashboard from "./analytics/VisualAnalyticsDashboard";
import AchievementProgressCard from "./analytics/AchievementProgressCard";
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
import { Heart, MessageCircle, Share, Eye, Trophy, Star, Zap, Crown, Shield, Target } from "lucide-react";

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      announce("Analytics dashboard refreshed");
      addNotification({
        type: "help",
        title: "Analytics Updated",
        message: "Your analytics dashboard has been refreshed with the latest data",
      });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Mock enhanced data - in real app this would come from API
  const personalImpactData = {
    userRank: 23,
    totalUsers: 15847,
    impactScore: 87,
    weeklyGrowth: 12,
    monthlyGrowth: 34,
    topPercentile: 5
  };

  const engagementMetrics = [
    {
      label: "Likes Received",
      value: 1247,
      growth: 23,
      comparison: 145,
      icon: Heart,
      color: "text-red-500"
    },
    {
      label: "Comments",
      value: 432,
      growth: 18,
      comparison: 127,
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      label: "Shares",
      value: 89,
      growth: -5,
      comparison: 98,
      icon: Share,
      color: "text-green-500"
    },
    {
      label: "Profile Views",
      value: 2341,
      growth: 45,
      comparison: 189,
      icon: Eye,
      color: "text-purple-500"
    }
  ];

  const networkData = {
    connectionGrowthData: [
      { month: "Jan", connections: 45, reach: 1200 },
      { month: "Feb", connections: 67, reach: 1850 },
      { month: "Mar", connections: 89, reach: 2400 },
      { month: "Apr", connections: 112, reach: 3100 },
      { month: "May", connections: 134, reach: 3900 },
      { month: "Jun", connections: 158, reach: 4750 }
    ],
    totalConnections: 158,
    networkReach: 4750,
    connectionVelocity: 28,
    influenceScore: 94,
    geographicSpread: 23
  };

  const comparativeMetrics = [
    {
      label: "Help Requests Completed",
      userValue: 47,
      avgValue: 12,
      topValue: 89,
      userPercentile: 85
    },
    {
      label: "Response Time (hours)",
      userValue: 2.3,
      avgValue: 8.7,
      topValue: 1.2,
      userPercentile: 92,
      unit: "h"
    },
    {
      label: "Community Engagement",
      userValue: 312,
      avgValue: 89,
      topValue: 567,
      userPercentile: 78
    }
  ];

  const visualData = {
    weeklyActivity: [
      { day: "Mon", posts: 3, likes: 45, comments: 12, connections: 2 },
      { day: "Tue", posts: 2, likes: 67, comments: 18, connections: 4 },
      { day: "Wed", posts: 4, likes: 34, comments: 8, connections: 1 },
      { day: "Thu", posts: 1, likes: 89, comments: 23, connections: 3 },
      { day: "Fri", posts: 5, likes: 112, comments: 31, connections: 6 },
      { day: "Sat", posts: 2, likes: 56, comments: 14, connections: 2 },
      { day: "Sun", posts: 3, likes: 78, comments: 19, connections: 1 }
    ],
    monthlyTrends: [
      { month: "Jan", impact: 65, engagement: 45, growth: 12 },
      { month: "Feb", impact: 72, engagement: 56, growth: 18 },
      { month: "Mar", impact: 78, engagement: 67, growth: 23 },
      { month: "Apr", impact: 85, engagement: 78, growth: 28 },
      { month: "May", impact: 91, engagement: 89, growth: 34 },
      { month: "Jun", impact: 87, engagement: 94, growth: 31 }
    ],
    categoryBreakdown: categoryData,
    timeSpentData: [
      { hour: "6AM", activeUsers: 45, yourActivity: 2 },
      { hour: "9AM", activeUsers: 234, yourActivity: 8 },
      { hour: "12PM", activeUsers: 567, yourActivity: 15 },
      { hour: "3PM", activeUsers: 432, yourActivity: 12 },
      { hour: "6PM", activeUsers: 678, yourActivity: 23 },
      { hour: "9PM", activeUsers: 345, yourActivity: 18 },
      { hour: "12AM", activeUsers: 123, yourActivity: 5 }
    ]
  };

  const achievementData = {
    achievements: [
      {
        id: "1",
        title: "Community Champion",
        description: "Help 50 people",
        progress: 47,
        maxProgress: 50,
        points: 500,
        rarity: "epic" as const,
        unlocked: false,
        icon: Trophy,
        category: "Helping"
      },
      {
        id: "2",
        title: "Social Butterfly",
        description: "Make 100 connections",
        progress: 100,
        maxProgress: 100,
        points: 200,
        rarity: "rare" as const,
        unlocked: true,
        icon: Star,
        category: "Networking"
      },
      {
        id: "3",
        title: "Speed Helper",
        description: "Respond in under 1 hour",
        progress: 89,
        maxProgress: 100,
        points: 300,
        rarity: "epic" as const,
        unlocked: false,
        icon: Zap,
        category: "Response Time"
      }
    ],
    totalPoints: 1847,
    unlockedCount: 12,
    nextMilestone: { title: "Trusted Leader", pointsNeeded: 153 }
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
    <div className="space-y-8" role="main" aria-label="Enhanced Analytics Dashboard">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Impact Analytics
        </h1>
        <p className="text-xl text-gray-600">
          Discover your influence and growth in our community
        </p>
      </div>

      {/* Top Level Impact Cards */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        <div className={isMobile ? 'col-span-1' : 'lg:col-span-2'}>
          <PersonalImpactCard {...personalImpactData} />
        </div>
        <AchievementProgressCard {...achievementData} />
      </div>

      {/* Engagement and Network Analytics */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <EngagementMetricsCard 
          metrics={engagementMetrics}
          totalEngagementScore={2847}
          rankPosition={23}
        />
        <NetworkAnalyticsCard {...networkData} />
      </div>

      {/* Comparative Analysis */}
      <ComparativeMetricsCard 
        metrics={comparativeMetrics}
        overallRanking={personalImpactData.userRank}
        totalUsers={personalImpactData.totalUsers}
      />

      {/* Visual Charts Dashboard */}
      <VisualAnalyticsDashboard {...visualData} />
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
