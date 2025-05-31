
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedMessaging from "./EnhancedMessaging";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import MainTabsList from "./tabs/MainTabsList";
import RealDiscoverConnectTab from "./tabs/RealDiscoverConnectTab";
import CampaignsTab from "./tabs/CampaignsTab";
import AnalyticsPointsTab from "./tabs/AnalyticsPointsTab";
import MobileBottomNav from "@/components/ui/mobile/mobile-bottom-nav";
import { MobileLayout } from "@/components/ui/mobile/mobile-layout";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
    onTabChange(tab);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Desktop Tabs - Hidden on mobile */}
        <div className={isMobile ? "hidden" : "block"}>
          <MainTabsList />
        </div>

        {/* Tab Content with proper mobile layout */}
        <MobileLayout hasBottomNav={isMobile} className="mt-6">
          <TabsContent value="feed" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Social Feed</h2>
              <EnhancedSocialFeed />
            </div>
          </TabsContent>

          <TabsContent value="discover-connect" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Discover & Connect</h2>
              <RealDiscoverConnectTab />
            </div>
          </TabsContent>

          <TabsContent value="messaging" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Messages</h2>
              <EnhancedMessaging />
            </div>
          </TabsContent>

          <TabsContent value="help-center" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Help Center</h2>
              <HelpCenter />
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Campaigns</h2>
              <CampaignsTab />
            </div>
          </TabsContent>

          <TabsContent value="analytics-points" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics & Points</h2>
              <AnalyticsPointsTab />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Profile</h2>
              <UserProfile />
            </div>
          </TabsContent>

          {/* Handle notifications tab for mobile (redirect to activity) */}
          <TabsContent value="notifications" className="mt-0">
            <div className="p-4 bg-white rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Activity & Notifications</h2>
              <p className="text-gray-600">Your activity feed and notifications will appear here.</p>
            </div>
          </TabsContent>
        </MobileLayout>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
