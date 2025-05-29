
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Download, 
  RefreshCw,
  Calendar,
  DollarSign
} from "lucide-react";
import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";
import RealTimeMetricsCard from "./RealTimeMetricsCard";
import DonorJourneyAnalytics from "./DonorJourneyAnalytics";
import PredictiveInsights from "./PredictiveInsights";
import { useToast } from "@/hooks/use-toast";

interface EnhancedCampaignAnalyticsProps {
  campaignId: string;
  campaignTitle?: string;
  goalAmount?: number;
  currentAmount?: number;
  daysRemaining?: number;
}

const EnhancedCampaignAnalytics = ({ 
  campaignId, 
  campaignTitle = "Campaign Analytics",
  goalAmount,
  currentAmount,
  daysRemaining 
}: EnhancedCampaignAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const { 
    data: analyticsData, 
    isLoading, 
    error, 
    refetch 
  } = useCampaignAnalytics(campaignId);

  const handleExport = () => {
    // In a real implementation, this would generate and download a comprehensive report
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated and will be downloaded shortly.",
    });
    
    // Mock export functionality
    console.log("Exporting analytics data:", analyticsData);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{campaignTitle} - Analytics</h2>
          <div className="flex space-x-2">
            <Button disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load analytics</h3>
            <p className="text-gray-600">There was an error loading your campaign analytics data.</p>
          </div>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="text-lg font-semibold">No Analytics Data Available</h3>
          <p className="text-gray-600">
            Analytics data will appear here once your campaign starts receiving engagement and donations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{campaignTitle} - Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Total Raised</div>
                <div className="text-xl font-bold">
                  ${analyticsData.analytics.donationAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Total Donors</div>
                <div className="text-xl font-bold">{analyticsData.donations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Countries Reached</div>
                <div className="text-xl font-bold">{analyticsData.geographicImpact.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Performance Score</div>
                <div className="text-xl font-bold">{analyticsData.performanceScore}/100</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="donors" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Donor Journey</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Predictions</span>
          </TabsTrigger>
          <TabsTrigger value="geographic" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Geographic</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <RealTimeMetricsCard analytics={analyticsData.analytics} />
        </TabsContent>

        <TabsContent value="donors" className="space-y-6">
          <DonorJourneyAnalytics donations={analyticsData.donations} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <PredictiveInsights 
            predictions={analyticsData.predictions}
            performanceScore={analyticsData.performanceScore}
            goalAmount={goalAmount}
            currentAmount={currentAmount}
            daysRemaining={daysRemaining}
          />
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Impact Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.geographicImpact.length > 0 ? (
                  analyticsData.geographicImpact.map((country, index) => (
                    <div key={country.countryCode} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{country.countryName}</div>
                          <div className="text-sm text-gray-500">
                            {country.donorCount} donors • {country.totalViews} views
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${country.totalDonations.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {((country.totalDonations / analyticsData.analytics.donationAmount) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-600">No geographic data available yet</h3>
                    <p className="text-gray-500 text-sm">
                      Geographic data will appear as your campaign receives donations from different regions.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCampaignAnalytics;
