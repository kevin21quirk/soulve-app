
import React, { useState } from "react";
import PersonalImpactCard from "./analytics/PersonalImpactCard";
import EngagementMetricsCard from "./analytics/EngagementMetricsCard";
import NetworkAnalyticsCard from "./analytics/NetworkAnalyticsCard";
import ComparativeMetricsCard from "./analytics/ComparativeMetricsCard";
import VisualAnalyticsDashboard from "./analytics/VisualAnalyticsDashboard";
import AchievementProgressCard from "./analytics/AchievementProgressCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useRealNetworkAnalytics } from "@/hooks/useRealNetworkAnalytics";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share, Eye, Trophy, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EnhancedAnalyticsDashboard = React.memo(() => {
  const {
    helpActivityData,
    engagementData,
    categoryData,
    impactMetrics,
    isLoading,
    error,
    refetch,
  } = useAnalyticsData();

  const { analytics: networkAnalytics } = useRealNetworkAnalytics();
  const { achievements } = useUserAchievements();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      refetch();
      toast({
        title: "Analytics Updated",
        description: "Your analytics dashboard has been refreshed with the latest data",
      });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Map real data from hooks - extract metrics safely
  const metrics = Array.isArray(impactMetrics) ? impactMetrics[0] : impactMetrics;
  const engagement = Array.isArray(engagementData) ? engagementData[0] : engagementData;
  
  const personalImpactData = {
    userRank: (metrics as any)?.userRank || 0,
    totalUsers: (metrics as any)?.totalUsers || 0,
    impactScore: (metrics as any)?.impactScore || 0,
    weeklyGrowth: (metrics as any)?.weeklyGrowth || 0,
    monthlyGrowth: (metrics as any)?.monthlyGrowth || 0,
    topPercentile: (metrics as any)?.percentile || 0
  };

  const engagementMetrics = [
    {
      label: "Likes Received",
      value: (engagement as any)?.likes || 0,
      growth: (engagement as any)?.likesGrowth || 0,
      comparison: 145,
      icon: Heart,
      color: "text-red-500"
    },
    {
      label: "Comments",
      value: (engagement as any)?.comments || 0,
      growth: (engagement as any)?.commentsGrowth || 0,
      comparison: 127,
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      label: "Shares",
      value: (engagement as any)?.shares || 0,
      growth: (engagement as any)?.sharesGrowth || 0,
      comparison: 98,
      icon: Share,
      color: "text-green-500"
    },
    {
      label: "Profile Views",
      value: (engagement as any)?.views || 0,
      growth: (engagement as any)?.viewsGrowth || 0,
      comparison: 189,
      icon: Eye,
      color: "text-purple-500"
    }
  ];

  const networkData = {
    connectionGrowthData: [],
    totalConnections: networkAnalytics.growthTrends?.connections_30d || 0,
    networkReach: networkAnalytics.influence?.networkReach || 0,
    connectionVelocity: networkAnalytics.growthTrends?.connections_7d || 0,
    influenceScore: 0,
    geographicSpread: networkAnalytics.geographicSpread?.cities || 0
  };

  const comparativeMetrics = [
    {
      label: "Help Requests Completed",
      userValue: (metrics as any)?.helpProvidedCount || 0,
      avgValue: 12,
      topValue: 89,
      userPercentile: (metrics as any)?.percentile || 0
    },
    {
      label: "Response Time (hours)",
      userValue: (metrics as any)?.responseTimeHours || 0,
      avgValue: 8.7,
      topValue: 1.2,
      userPercentile: (metrics as any)?.percentile || 0,
      unit: "h"
    },
    {
      label: "Community Engagement",
      userValue: (engagement as any)?.totalEngagement || 0,
      avgValue: 89,
      topValue: 567,
      userPercentile: (metrics as any)?.percentile || 0
    }
  ];

  const visualData = {
    weeklyActivity: [
      { day: "Mon", posts: 2, likes: 15, comments: 8, connections: 2 },
      { day: "Tue", posts: 1, likes: 22, comments: 12, connections: 4 },
      { day: "Wed", posts: 3, likes: 18, comments: 6, connections: 1 },
      { day: "Thu", posts: 2, likes: 25, comments: 15, connections: 3 },
      { day: "Fri", posts: 4, likes: 30, comments: 18, connections: 6 },
      { day: "Sat", posts: 1, likes: 12, comments: 5, connections: 2 },
      { day: "Sun", posts: 2, likes: 20, comments: 10, connections: 1 }
    ],
    monthlyTrends: [
      { month: "Jan", impact: 65, engagement: 45, growth: 12 },
      { month: "Feb", impact: 72, engagement: 56, growth: 18 },
      { month: "Mar", impact: 78, engagement: 67, growth: 23 },
      { month: "Apr", impact: 85, engagement: 78, growth: 28 },
      { month: "May", impact: 91, engagement: 89, growth: 34 },
      { month: "Jun", impact: 87, engagement: 94, growth: 31 }
    ],
    categoryBreakdown: categoryData || [],
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
    achievements: achievements.slice(0, 3).map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      progress: a.progress,
      maxProgress: a.maxProgress,
      points: a.pointsReward,
      rarity: a.rarity,
      unlocked: a.unlocked,
      icon: Trophy,
      category: "Achievement"
    })),
    totalPoints: (metrics as any)?.impactScore || 0,
    unlockedCount: achievements.filter(a => a.unlocked).length,
    nextMilestone: { title: "Trusted Leader", pointsNeeded: 153 }
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Analytics Error</h3>
        <p className="text-gray-600 mb-4">Failed to load analytics data</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" role="main" aria-label="Enhanced Analytics Dashboard">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Impact Analytics
          </h1>
          <Badge className="bg-green-500 text-white flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Live</span>
          </Badge>
        </div>
        <p className="text-xl text-gray-600">
          Discover your influence and growth in our community
        </p>
      </div>

      {/* Top Level Impact Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PersonalImpactCard {...personalImpactData} />
        </div>
        <AchievementProgressCard {...achievementData} />
      </div>

      {/* Engagement and Network Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
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
});

EnhancedAnalyticsDashboard.displayName = "EnhancedAnalyticsDashboard";

export default EnhancedAnalyticsDashboard;
