
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CampaignAnalyticsTabs from "./CampaignAnalyticsTabs";
import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";

const EnhancedCampaignAnalyticsDashboard = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  
  // Use the campaign analytics hook
  const { data: analyticsData, isLoading, error } = useCampaignAnalytics(campaignId || "");

  // Mock campaign data - in real app this would come from API
  const campaignInfo = {
    title: "Community Garden Project",
    status: "active",
    daysRunning: 23,
    lastUpdated: "2 hours ago"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Analytics</h3>
                <p className="text-gray-600 mb-4">Unable to load campaign analytics data.</p>
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{campaignInfo.title}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={campaignInfo.status === 'active' ? 'default' : 'secondary'}>
                      {campaignInfo.status}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Running for {campaignInfo.daysRunning} days
                    </span>
                    <span className="text-sm text-gray-600">
                      Last updated: {campaignInfo.lastUpdated}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Campaign ID</div>
                  <div className="font-mono text-sm">{campaignId}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <CampaignAnalyticsTabs campaignId={campaignId || ""} />
      </div>
    </div>
  );
};

export default EnhancedCampaignAnalyticsDashboard;
