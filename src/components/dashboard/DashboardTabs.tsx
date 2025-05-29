
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SocialFeed from "./SocialFeed";
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
      <MainTabsList />

      <TabsContent value="feed" className="mt-6">
        <SocialFeed />
      </TabsContent>

      <TabsContent value="discover-connect" className="mt-6">
        <DiscoverConnectTab />
      </TabsContent>

      <TabsContent value="messaging" className="mt-6">
        <EnhancedMessaging />
      </TabsContent>

      <TabsContent value="help-center" className="mt-6">
        <HelpCenter />
      </TabsContent>

      <TabsContent value="campaigns" className="mt-6">
        <CampaignsTab />
      </TabsContent>

      <TabsContent value="analytics-points" className="mt-6">
        <AnalyticsPointsTab />
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <UserProfile />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
