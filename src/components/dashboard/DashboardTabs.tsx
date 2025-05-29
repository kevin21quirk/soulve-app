
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedMessaging from "./EnhancedMessaging";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import MainTabsList from "./tabs/MainTabsList";
import DiscoverConnectTab from "./tabs/DiscoverConnectTab";
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

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        {/* Desktop Tabs - Hidden on mobile */}
        <div className={isMobile ? "hidden" : "block"}>
          <MainTabsList />
        </div>

        {/* Tab Content with proper mobile layout */}
        <MobileLayout hasBottomNav={isMobile} className="mt-6">
          <TabsContent value="feed" className="mt-0">
            <EnhancedSocialFeed />
          </TabsContent>

          <TabsContent value="discover-connect" className="mt-0">
            <DiscoverConnectTab />
          </TabsContent>

          <TabsContent value="messaging" className="mt-0">
            <EnhancedMessaging />
          </TabsContent>

          <TabsContent value="help-center" className="mt-0">
            <HelpCenter />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0">
            <CampaignsTab />
          </TabsContent>

          <TabsContent value="analytics-points" className="mt-0">
            <AnalyticsPointsTab />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <UserProfile />
          </TabsContent>
        </MobileLayout>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={onTabChange} />
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
