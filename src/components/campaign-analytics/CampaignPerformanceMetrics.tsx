
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  Share2, 
  Eye,
  Award,
  AlertCircle
} from "lucide-react";

interface CampaignPerformanceMetricsProps {
  analytics: {
    totalViews: number;
    uniqueViews: number;
    totalDonations: number;
    donationAmount: number;
    socialShares: number;
    commentCount: number;
    conversionRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };
  goalAmount?: number;
  currentAmount?: number;
  daysRemaining?: number;
  performanceScore: number;
}

const CampaignPerformanceMetrics = ({ 
  analytics, 
  goalAmount, 
  currentAmount, 
  daysRemaining,
  performanceScore 
}: CampaignPerformanceMetricsProps) => {
  const progressPercentage = goalAmount && currentAmount 
    ? Math.min((currentAmount / goalAmount) * 100, 100) 
    : 0;

  const conversionRate = analytics.totalViews > 0 
    ? (analytics.totalDonations / analytics.totalViews) * 100 
    : 0;

  const avgDonationAmount = analytics.totalDonations > 0 
    ? analytics.donationAmount / analytics.totalDonations 
    : 0;

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "bg-green-500", textColor: "text-green-700" };
    if (score >= 60) return { level: "Good", color: "bg-blue-500", textColor: "text-blue-700" };
    if (score >= 40) return { level: "Fair", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { level: "Needs Improvement", color: "bg-red-500", textColor: "text-red-700" };
  };

  const performance = getPerformanceLevel(performanceScore);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Campaign Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-purple-600">{performanceScore}/100</div>
            <Badge className={`${performance.color} text-white`}>
              {performance.level}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Your campaign is performing {performance.level.toLowerCase()} compared to similar campaigns
          </p>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      {goalAmount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Goal Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">£{currentAmount?.toLocaleString() || 0}</span>
                <span className="text-lg text-gray-600">of £{goalAmount.toLocaleString()}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{progressPercentage.toFixed(1)}% complete</span>
                {daysRemaining !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{daysRemaining} days remaining</span>
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Total Views</div>
                <div className="text-xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  {analytics.uniqueViews.toLocaleString()} unique
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Donors</div>
                <div className="text-xl font-bold">{analytics.totalDonations}</div>
                <div className="text-xs text-gray-500">
                  £{avgDonationAmount.toFixed(2)} avg
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Shares</div>
                <div className="text-xl font-bold">{analytics.socialShares}</div>
                <div className="text-xs text-gray-500">
                  {analytics.commentCount} comments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Conversion</div>
                <div className="text-xl font-bold">{conversionRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">
                  {analytics.bounceRate.toFixed(1)}% bounce rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span>Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversionRate > 2 ? (
              <div className="flex items-center space-x-2 text-green-700">
                <TrendingUp className="h-4 w-4" />
                <span>Great conversion rate! Your campaign is resonating well with visitors.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <span>Consider improving your campaign description to increase conversion rate.</span>
              </div>
            )}

            {analytics.socialShares > analytics.totalViews * 0.1 ? (
              <div className="flex items-center space-x-2 text-green-700">
                <Share2 className="h-4 w-4" />
                <span>Excellent social engagement! Your content is being shared actively.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-blue-700">
                <Share2 className="h-4 w-4" />
                <span>Add more shareable content to increase social reach.</span>
              </div>
            )}

            {analytics.avgTimeOnPage > 60 ? (
              <div className="flex items-center space-x-2 text-green-700">
                <Eye className="h-4 w-4" />
                <span>Visitors are spending good time reading your campaign.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-orange-700">
                <Eye className="h-4 w-4" />
                <span>Consider adding more engaging content to increase time on page.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignPerformanceMetrics;
