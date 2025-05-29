
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedMessaging from "./EnhancedMessaging";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import MainTabsList from "./tabs/MainTabsList";
import DiscoverConnectTab from "./tabs/DiscoverConnectTab";
import CampaignsTab from "./tabs/CampaignsTab";
import AnalyticsPointsTab from "./tabs/AnalyticsPointsTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <MainTabsList activeTab={activeTab} onTabChange={onTabChange} />

      <TabsContent value="feed" className="mt-6">
        <EnhancedSocialFeed />
      </TabsContent>

      <TabsContent value="help" className="mt-6">
        <HelpCenter />
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <UserProfile />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Settings panel coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="discover-connect" className="mt-6">
        <DiscoverConnectTab />
      </TabsContent>

      <TabsContent value="messaging" className="mt-6">
        <EnhancedMessaging />
      </TabsContent>

      <TabsContent value="campaigns" className="mt-6">
        <CampaignsTab />
      </TabsContent>

      <TabsContent value="analytics-points" className="mt-6">
        <AnalyticsPointsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
