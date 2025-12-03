import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { lazy, Suspense, useState, useEffect } from "react";
import MainTabsList from "./tabs/MainTabsList";
import FeedTab from "./tabs/FeedTab";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load non-critical tabs
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

const TabSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const DashboardTabs = ({ activeTab, onTabChange, organizationId }: DashboardTabsProps) => {
  const isMobile = useIsMobile();
  // Track which tabs have been visited to enable deferred mounting
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['feed']));

  // Mark tab as visited when it becomes active
  useEffect(() => {
    if (activeTab && !visitedTabs.has(activeTab)) {
      setVisitedTabs(prev => new Set([...prev, activeTab]));
    }
  }, [activeTab, visitedTabs]);

  if (isMobile) {
    return null;
  }

  // Helper to check if tab should render content
  const shouldRenderTab = (tabName: string) => visitedTabs.has(tabName);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <MainTabsList />

      {/* Feed tab - always mounted immediately */}
      <TabsContent value="feed" className="space-y-6" forceMount>
        <div className={activeTab !== "feed" ? "hidden" : ""}>
          <FeedTab organizationId={organizationId} />
        </div>
      </TabsContent>

      {/* Discover tab - deferred loading */}
      <TabsContent value="discover-connect" className="space-y-6" forceMount>
        <div className={activeTab !== "discover-connect" ? "hidden" : ""}>
          {shouldRenderTab("discover-connect") && (
            <Suspense fallback={<TabSkeleton />}>
              <DiscoverTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Messaging tab - deferred loading */}
      <TabsContent value="messaging" className="space-y-6" forceMount>
        <div className={activeTab !== "messaging" ? "hidden" : ""}>
          {shouldRenderTab("messaging") && (
            <Suspense fallback={<TabSkeleton />}>
              <MessagingTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Campaigns tab - deferred loading */}
      <TabsContent value="campaigns" className="space-y-6" forceMount>
        <div className={activeTab !== "campaigns" ? "hidden" : ""}>
          {shouldRenderTab("campaigns") && (
            <Suspense fallback={<TabSkeleton />}>
              <CampaignsTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Organisation tools tab - deferred loading */}
      <TabsContent value="organisation-tools" className="space-y-6" forceMount>
        <div className={activeTab !== "organisation-tools" ? "hidden" : ""}>
          {shouldRenderTab("organisation-tools") && (
            <Suspense fallback={<TabSkeleton />}>
              <OrganizationTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Impact analytics tab - deferred loading */}
      <TabsContent value="impact-analytics" className="space-y-6" forceMount>
        <div className={activeTab !== "impact-analytics" ? "hidden" : ""}>
          {shouldRenderTab("impact-analytics") && (
            <Suspense fallback={<TabSkeleton />}>
              <CombinedImpactAnalyticsTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Help center tab - deferred loading */}
      <TabsContent value="help-center" className="space-y-6" forceMount>
        <div className={activeTab !== "help-center" ? "hidden" : ""}>
          {shouldRenderTab("help-center") && (
            <Suspense fallback={<TabSkeleton />}>
              <EnhancedHelpCenterTab />
            </Suspense>
          )}
        </div>
      </TabsContent>

      {/* Profile tab - deferred loading */}
      <TabsContent value="profile" className="space-y-6" forceMount>
        <div className={activeTab !== "profile" ? "hidden" : ""}>
          {shouldRenderTab("profile") && (
            <Suspense fallback={<TabSkeleton />}>
              <ProfileTab />
            </Suspense>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
