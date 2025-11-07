
import { lazy, Suspense } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import MainTabsList from "./tabs/MainTabsList";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load heavy tab components for better performance
const FeedTab = lazy(() => import("./tabs/FeedTab"));
const DiscoverTab = lazy(() => import("./tabs/DiscoverTab"));
const CampaignsTab = lazy(() => import("./tabs/CampaignsTab"));
const MessagingTab = lazy(() => import("./tabs/MessagingTab"));
const ProfileTab = lazy(() => import("./tabs/ProfileTab"));
const CombinedImpactAnalyticsTab = lazy(() => import("./tabs/CombinedImpactAnalyticsTab"));
const EnhancedHelpCenterTab = lazy(() => import("./tabs/EnhancedHelpCenterTab"));
const OrganizationTab = lazy(() => import("../tabs/OrganizationTab"));

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

      <Suspense fallback={<LoadingState message="Loading feed..." />}>
        <TabsContent value="feed" className="space-y-6">
          <FeedTab organizationId={organizationId} />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading discover..." />}>
        <TabsContent value="discover-connect" className="space-y-6">
          <DiscoverTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading messages..." />}>
        <TabsContent value="messaging" className="space-y-6">
          <MessagingTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading campaigns..." />}>
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading organization..." />}>
        <TabsContent value="organisation-tools" className="space-y-6">
          <OrganizationTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading analytics..." />}>
        <TabsContent value="impact-analytics" className="space-y-6">
          <CombinedImpactAnalyticsTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading help center..." />}>
        <TabsContent value="help-center" className="space-y-6">
          <EnhancedHelpCenterTab />
        </TabsContent>
      </Suspense>

      <Suspense fallback={<LoadingState message="Loading profile..." />}>
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>
      </Suspense>
    </Tabs>
  );
};

export default DashboardTabs;
