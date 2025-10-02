
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface PerformanceInsight {
  type: 'success' | 'warning' | 'info' | 'suggestion';
  title: string;
  description: string;
  metric?: {
    value: number;
    target: number;
    unit: string;
  };
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

interface PerformanceInsightsPanelProps {
  campaignId: string;
  analytics: {
    totalViews: number;
    uniqueViews: number;
    totalDonations: number;
    donationAmount: number;
    conversionRate: number;
    socialShares: number;
  };
  goalAmount?: number;
  daysRemaining?: number;
}

const PerformanceInsightsPanel = ({ 
  campaignId, 
  analytics, 
  goalAmount = 10000,
  daysRemaining = 15 
}: PerformanceInsightsPanelProps) => {
  const insights: PerformanceInsight[] = React.useMemo(() => {
    const results: PerformanceInsight[] = [];
    
    // Goal progress insight
    const goalProgress = (analytics.donationAmount / goalAmount) * 100;
    if (goalProgress >= 80) {
      results.push({
        type: 'success',
        title: 'Excellent Progress!',
        description: 'Your campaign is performing exceptionally well and is likely to reach its goal.',
        metric: { value: goalProgress, target: 100, unit: '%' },
        trend: { direction: 'up', percentage: 12.5 }
      });
    } else if (goalProgress >= 50) {
      results.push({
        type: 'info',
        title: 'Good Momentum',
        description: 'Your campaign is making steady progress toward the goal.',
        metric: { value: goalProgress, target: 100, unit: '%' },
        trend: { direction: 'up', percentage: 8.3 }
      });
    } else {
      results.push({
        type: 'warning',
        title: 'Needs Attention',
        description: 'Consider increasing promotion efforts to reach your goal on time.',
        metric: { value: goalProgress, target: 100, unit: '%' },
        trend: { direction: 'down', percentage: -2.1 }
      });
    }

    // Conversion rate insight
    if (analytics.conversionRate < 2) {
      results.push({
        type: 'suggestion',
        title: 'Improve Conversion',
        description: 'Your conversion rate could be improved with better call-to-action buttons.',
        metric: { value: analytics.conversionRate, target: 5, unit: '%' }
      });
    }

    // Social sharing insight
    if (analytics.socialShares < analytics.totalDonations * 2) {
      results.push({
        type: 'suggestion',
        title: 'Boost Social Sharing',
        description: 'Encourage supporters to share your campaign to increase reach.',
        metric: { value: analytics.socialShares, target: analytics.totalDonations * 3, unit: 'shares' }
      });
    }

    // Time-based insight
    const dailyTarget = goalAmount / 30; // Assuming 30-day campaign
    const currentDaily = analytics.donationAmount / (30 - daysRemaining);
    if (currentDaily < dailyTarget) {
      results.push({
        type: 'warning',
        title: 'Pace Behind Target',
        description: `Need £${dailyTarget.toFixed(0)}/day to reach goal. Current pace: £${currentDaily.toFixed(0)}/day`,
        trend: { direction: 'down', percentage: -15.2 }
      });
    }

    return results;
  }, [analytics, goalAmount, daysRemaining]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Target className="h-5 w-5 text-blue-600" />;
      case 'suggestion': return <TrendingUp className="h-5 w-5 text-purple-600" />;
      default: return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suggestion': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getInsightBadgeColor(insight.type).replace('text-', 'border-').replace('800', '200')}`}>
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  {insight.trend && (
                    <div className={`flex items-center gap-1 text-sm ${
                      insight.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insight.trend.direction === 'up' ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                      {Math.abs(insight.trend.percentage)}%
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                
                {insight.metric && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{insight.metric.value.toFixed(1)} / {insight.metric.target} {insight.metric.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min((insight.metric.value / insight.metric.target) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PerformanceInsightsPanel;
