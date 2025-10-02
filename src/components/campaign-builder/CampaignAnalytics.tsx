
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PoundSterling,
  Eye,
  Share2,
  Heart,
  MessageCircle
} from "lucide-react";

const CampaignAnalytics = () => {
  // Mock data for analytics
  const analyticsData = {
    totalRaised: 12450,
    goal: 20000,
    supporters: 89,
    views: 2340,
    shares: 156,
    comments: 47,
    conversionRate: 3.8,
    avgDonation: 140
  };

  const progressPercentage = (analyticsData.totalRaised / analyticsData.goal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
        <p className="text-gray-600 mt-1">Track your campaign's performance and insights</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PoundSterling className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold">£{analyticsData.totalRaised.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Supporters</p>
                <p className="text-2xl font-bold">{analyticsData.supporters}</p>
                <p className="text-xs text-blue-600">+8 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{analyticsData.views.toLocaleString()}</p>
                <p className="text-xs text-purple-600">+156 today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                <p className="text-xs text-orange-600">Above average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>£{analyticsData.totalRaised.toLocaleString()} raised</span>
              <span>£{analyticsData.goal.toLocaleString()} goal</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% of goal reached
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">£{analyticsData.avgDonation}</p>
              <p className="text-sm text-gray-600">Avg. Donation</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{analyticsData.shares}</p>
              <p className="text-sm text-gray-600">Social Shares</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{analyticsData.comments}</p>
              <p className="text-sm text-gray-600">Comments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Likes</span>
                </div>
                <Badge variant="secondary">234</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Shares</span>
                </div>
                <Badge variant="secondary">{analyticsData.shares}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Comments</span>
                </div>
                <Badge variant="secondary">{analyticsData.comments}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Strong Performance</p>
                <p className="text-xs text-green-600">Your conversion rate is 40% above average</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Social Reach</p>
                <p className="text-xs text-blue-600">Content is being shared frequently</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Opportunity</p>
                <p className="text-xs text-yellow-600">Consider promoting during peak hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
