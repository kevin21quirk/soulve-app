
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import CampaignsTab from "./tabs/CampaignsTab";
import MessagingTab from "./tabs/MessagingTab";
import ProfileTab from "./tabs/ProfileTab";
import NotificationsTab from "./tabs/NotificationsTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile tabs are handled by MobileDashboard
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-6">
        <TabsTrigger value="feed">Feed</TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        <TabsTrigger value="messaging">Messages</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="space-y-6">
        <FeedTab />
      </TabsContent>

      <TabsContent value="discover" className="space-y-6">
        <DiscoverTab />
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-6">
        <CampaignsTab />
      </TabsContent>

      <TabsContent value="messaging" className="space-y-6">
        <MessagingTab />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <NotificationsTab />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
