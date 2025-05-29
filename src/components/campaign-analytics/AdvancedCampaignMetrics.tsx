
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Eye, Share2 } from "lucide-react";

interface AdvancedCampaignMetricsProps {
  campaignId: string;
}

const AdvancedCampaignMetrics = ({ campaignId }: AdvancedCampaignMetricsProps) => {
  // Mock data - in real app this would come from useCampaignAnalytics hook
  const metrics = {
    fundingProgress: 68,
    totalRaised: 13600,
    goalAmount: 20000,
    donorCount: 127,
    avgDonation: 107,
    viewCount: 3420,
    shareCount: 89,
    conversionRate: 3.7,
    timeRemaining: 18,
    dailyGrowth: 5.2,
    weeklyTrend: 12.8
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Campaign Progress
            <Badge variant={metrics.fundingProgress >= 75 ? "default" : "secondary"}>
              {metrics.timeRemaining} days left
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">${metrics.totalRaised.toLocaleString()}</span>
              <span className="text-gray-600">of ${metrics.goalAmount.toLocaleString()}</span>
            </div>
            <Progress value={metrics.fundingProgress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{metrics.fundingProgress}% funded</span>
              <span>${(metrics.goalAmount - metrics.totalRaised).toLocaleString()} to go</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Donors</div>
                <div className="text-xl font-bold">{metrics.donorCount}</div>
                <div className="flex items-center text-xs text-green-600">
                  {getTrendIcon(metrics.weeklyTrend)}
                  +{metrics.weeklyTrend}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Avg Donation</div>
                <div className="text-xl font-bold">${metrics.avgDonation}</div>
                <div className="flex items-center text-xs text-green-600">
                  {getTrendIcon(metrics.dailyGrowth)}
                  +{metrics.dailyGrowth}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Views</div>
                <div className="text-xl font-bold">{metrics.viewCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Conversion</div>
                <div className="text-xl font-bold">{metrics.conversionRate}%</div>
                <div className="text-xs text-gray-500">View to donation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Strong Growth Momentum</span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                +{metrics.weeklyTrend}% this week
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Above Average Conversion</span>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                {metrics.conversionRate}% vs 2.5% avg
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Recommended Action</span>
              </div>
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                Increase social sharing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCampaignMetrics;
