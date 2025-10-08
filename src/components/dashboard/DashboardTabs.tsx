
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import CampaignsTab from "./tabs/CampaignsTab";
import MessagingTab from "./tabs/MessagingTab";
import ProfileTab from "./tabs/ProfileTab";
import MainTabsList from "./tabs/MainTabsList";
import CombinedImpactAnalyticsTab from "./tabs/CombinedImpactAnalyticsTab";
import EnhancedHelpCenterTab from "./tabs/EnhancedHelpCenterTab";
import OrganizationTab from "../tabs/OrganizationTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  organizationId?: string | null;
}

const DashboardTabs = ({ activeTab, onTabChange, organizationId }: DashboardTabsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <MainTabsList />

      <TabsContent value="feed" className="space-y-6">
        <FeedTab organizationId={organizationId} />
      </TabsContent>

      <TabsContent value="discover-connect" className="space-y-6">
        <DiscoverTab />
      </TabsContent>

      <TabsContent value="messaging" className="space-y-6">
        <MessagingTab />
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-6">
        <CampaignsTab />
      </TabsContent>

      <TabsContent value="organisation-tools" className="space-y-6">
        <OrganizationTab />
      </TabsContent>

      <TabsContent value="impact-analytics" className="space-y-6">
        <CombinedImpactAnalyticsTab />
      </TabsContent>

      <TabsContent value="help-center" className="space-y-6">
        <EnhancedHelpCenterTab />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
