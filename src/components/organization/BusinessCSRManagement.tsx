import { useState } from "react";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import CommunityNeedsDiscovery from "./csr/CommunityNeedsDiscovery";
import CampaignPartnershipHub from "./csr/CampaignPartnershipHub";
import CSRMarketplace from "./csr/CSRMarketplace";
import CSRAnalyticsDashboard from "./csr/CSRAnalyticsDashboard";

interface BusinessCSRManagementProps {
  organizationId: string;
}

const BusinessCSRManagement = ({ organizationId }: BusinessCSRManagementProps) => {
  const [activeTab, setActiveTab] = useState("discovery");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Community-Connected CSR Suite
        </h2>
        <p className="text-muted-foreground">
          Bridge your CSR investments with real community needs and create measurable social impact
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discovery">Community Needs</TabsTrigger>
          <TabsTrigger value="partnerships">Campaign Partners</TabsTrigger>
          <TabsTrigger value="marketplace">Create Campaign</TabsTrigger>
          <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
        </MobileAwareTabsList>

        <TabsContent value="discovery" className="mt-6">
          <CommunityNeedsDiscovery />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <CampaignPartnershipHub />
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6">
          <CSRMarketplace />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CSRAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessCSRManagement;