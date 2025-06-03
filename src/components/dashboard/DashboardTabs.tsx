
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import CampaignsTab from "./tabs/CampaignsTab";
import MessagingTab from "./tabs/MessagingTab";
import ProfileTab from "./tabs/ProfileTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ImpactTab from "./tabs/ImpactTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import MainTabsList from "./tabs/MainTabsList";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <MainTabsList />

      <TabsContent value="feed" className="space-y-6">
        <FeedTab />
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

      <TabsContent value="impact" className="space-y-6">
        <ImpactTab />
      </TabsContent>

      <TabsContent value="analytics-points" className="space-y-6">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
