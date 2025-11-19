
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import MainTabsList from "./tabs/MainTabsList";
import FeedTab from "./tabs/FeedTab";
import DiscoverTab from "./tabs/DiscoverTab";
import CampaignsTab from "./tabs/CampaignsTab";
import MessagingTab from "./tabs/MessagingTab";
import ProfileTab from "./tabs/ProfileTab";
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
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full">
      <MainTabsList />

      <TabsContent value="feed" className="space-y-6" forceMount>
        <div className={activeTab !== "feed" ? "hidden" : ""}>
          <FeedTab organizationId={organizationId} />
        </div>
      </TabsContent>

      <TabsContent value="discover-connect" className="space-y-6" forceMount>
        <div className={activeTab !== "discover-connect" ? "hidden" : ""}>
          <DiscoverTab />
        </div>
      </TabsContent>

      <TabsContent value="messaging" className="h-full" forceMount>
        <div className={activeTab !== "messaging" ? "hidden" : "h-full"}>
          <MessagingTab />
        </div>
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-6" forceMount>
        <div className={activeTab !== "campaigns" ? "hidden" : ""}>
          <CampaignsTab />
        </div>
      </TabsContent>

      <TabsContent value="organisation-tools" className="space-y-6" forceMount>
        <div className={activeTab !== "organisation-tools" ? "hidden" : ""}>
          <OrganizationTab />
        </div>
      </TabsContent>

      <TabsContent value="impact-analytics" className="space-y-6" forceMount>
        <div className={activeTab !== "impact-analytics" ? "hidden" : ""}>
          <CombinedImpactAnalyticsTab />
        </div>
      </TabsContent>

      <TabsContent value="help-center" className="space-y-6" forceMount>
        <div className={activeTab !== "help-center" ? "hidden" : ""}>
          <EnhancedHelpCenterTab />
        </div>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6" forceMount>
        <div className={activeTab !== "profile" ? "hidden" : ""}>
          <ProfileTab />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
