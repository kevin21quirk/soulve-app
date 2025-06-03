
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import CampaignsTab from "./tabs/CampaignsTab";
import MessagingTab from "./tabs/MessagingTab";
import ProfileTab from "./tabs/ProfileTab";
import NotificationsTab from "./tabs/NotificationsTab";
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

      <TabsContent value="help-center" className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Help Center</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-6">
        <CampaignsTab />
      </TabsContent>

      <TabsContent value="impact" className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact Dashboard</h2>
          <p className="text-gray-600">Track your community impact and contributions</p>
        </div>
      </TabsContent>

      <TabsContent value="analytics-points" className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Points</h2>
          <p className="text-gray-600">View your analytics and point system</p>
        </div>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
