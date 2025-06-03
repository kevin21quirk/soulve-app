
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MainTabsList from "./tabs/MainTabsList";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import ConnectionsTab from "./tabs/ConnectionsTab";
import MessagingTab from "./tabs/MessagingTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import ProfileTab from "./tabs/ProfileTab";
import AdminTab from "./tabs/AdminTab";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <Tabs value={activeTab} className="w-full">
      <MainTabsList activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        <TabsContent value="feed">
          <FeedTab />
        </TabsContent>
        
        <TabsContent value="discover">
          <DiscoverTab />
        </TabsContent>
        
        <TabsContent value="connections">
          <ConnectionsTab />
        </TabsContent>
        
        <TabsContent value="messaging">
          <MessagingTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="admin">
          <AdminTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="text-center py-8">
            <p className="text-gray-500">Settings panel coming soon!</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DashboardTabs;
