
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedCampaignMetrics from "./AdvancedCampaignMetrics";
import DonationTrendChart from "./DonationTrendChart";
import EngagementAnalytics from "./EngagementAnalytics";
import PredictiveInsightsPanel from "./PredictiveInsightsPanel";
import { BarChart3, TrendingUp, Users, Brain } from "lucide-react";

interface CampaignAnalyticsTabsProps {
  campaignId: string;
}

const CampaignAnalyticsTabs = ({ campaignId }: CampaignAnalyticsTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gray-100">
        <TabsTrigger 
          value="overview" 
          className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="donations" 
          className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Donations</span>
        </TabsTrigger>
        <TabsTrigger 
          value="engagement" 
          className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <Users className="h-4 w-4" />
          <span>Engagement</span>
        </TabsTrigger>
        <TabsTrigger 
          value="insights" 
          className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <Brain className="h-4 w-4" />
          <span>AI Insights</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <AdvancedCampaignMetrics campaignId={campaignId} />
      </TabsContent>

      <TabsContent value="donations" className="mt-6">
        <DonationTrendChart />
      </TabsContent>

      <TabsContent value="engagement" className="mt-6">
        <EngagementAnalytics />
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        <PredictiveInsightsPanel />
      </TabsContent>
    </Tabs>
  );
};

export default CampaignAnalyticsTabs;
