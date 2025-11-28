import { useState } from "react";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import CSROverview from "./csr/CSROverview";
import CommunityNeedsDiscovery from "./csr/CommunityNeedsDiscovery";
import CampaignPartnershipHub from "./csr/CampaignPartnershipHub";
import CSRMarketplace from "./csr/CSRMarketplace";
import CSRAnalyticsDashboard from "./csr/CSRAnalyticsDashboard";

interface BusinessCSRManagementProps {
  organizationId: string;
}

const BusinessCSRManagement = ({ organizationId }: BusinessCSRManagementProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">
          Corporate Social Responsibility Suite
        </h2>
        <p className="text-white/90">
          Connect your CSR investments with real community needs and create measurable social impact
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="reporting">Impact & Reporting</TabsTrigger>
        </MobileAwareTabsList>

        <TabsContent value="overview" className="mt-6">
          <CSROverview onNavigateToTab={handleNavigateToTab} />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <div className="space-y-6">
            <CommunityNeedsDiscovery />
            <CampaignPartnershipHub />
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="mt-6">
          <CSRMarketplace />
        </TabsContent>

        <TabsContent value="reporting" className="mt-6">
          <CSRAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessCSRManagement;