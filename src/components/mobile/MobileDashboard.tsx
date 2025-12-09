import { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import MobileNavigation from "./MobileNavigation";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { ProfileSwitcher } from "@/components/profile/ProfileSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load all tab components - only FeedTab loads immediately
const FeedTab = lazy(() => import("@/components/dashboard/tabs/FeedTab"));
const DiscoverTab = lazy(() => import("@/components/dashboard/tabs/DiscoverTab"));
const MessagingTab = lazy(() => import("@/components/dashboard/tabs/MessagingTab"));
const CampaignsTab = lazy(() => import("@/components/dashboard/tabs/CampaignsTab"));
const OrganizationTab = lazy(() => import("@/components/tabs/OrganizationTab"));
const CombinedImpactAnalyticsTab = lazy(() => import("@/components/dashboard/tabs/CombinedImpactAnalyticsTab"));
const EnhancedHelpCenterTab = lazy(() => import("@/components/dashboard/tabs/EnhancedHelpCenterTab"));
const ProfileTab = lazy(() => import("@/components/dashboard/tabs/ProfileTab"));

const TabSkeleton = () => (
  <div className="p-4 min-h-[calc(100vh-120px)]">
    <LoadingState message="Loading..." size="md" />
  </div>
);

const MobileDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("feed");
  const context = searchParams.get('context') || 'personal';
  const orgId = searchParams.get('orgId');
  const [orgName, setOrgName] = useState<string>('');
  
  // Track visited tabs to only render them once visited
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['feed']));

  // Load organization name if in org context
  useEffect(() => {
    const loadOrgName = async () => {
      if (context === 'org' && orgId) {
        const { data } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', orgId)
          .single();
        if (data) setOrgName(data.name);
      }
    };
    loadOrgName();
  }, [context, orgId]);

  // Track visited tabs
  useEffect(() => {
    if (!visitedTabs.has(activeTab)) {
      setVisitedTabs(prev => new Set([...prev, activeTab]));
    }
  }, [activeTab, visitedTabs]);

  const organizationId = context === 'org' ? orgId : null;

  const shouldRenderTab = (tabName: string) => visitedTabs.has(tabName);

  return (
    <div className="min-h-screen bg-background">
      {/* Context Header */}
      {context === 'org' && orgName && (
        <div className="sticky top-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
          <Badge variant="secondary" className="gap-1.5">
            <Building className="h-3 w-3" />
            <span>{orgName}</span>
          </Badge>
          <ProfileSwitcher 
            currentView="organization"
            currentOrgId={orgId || undefined}
          />
        </div>
      )}

      {/* Content - Only render visited tabs, hide inactive ones. Min height prevents layout shift */}
      <div className="w-full min-h-[calc(100vh-80px)]">
        <Suspense fallback={<TabSkeleton />}>
          {/* Feed Tab - Always rendered first */}
          <div className={activeTab === 'feed' ? 'pb-20' : 'hidden'}>
            <FeedTab organizationId={organizationId} />
          </div>

          {/* Other tabs - Only render when visited */}
          {shouldRenderTab('discover') && (
            <div className={activeTab === 'discover' ? 'pb-20' : 'hidden'}>
              <DiscoverTab />
            </div>
          )}

          {shouldRenderTab('messaging') && (
            <div className={activeTab === 'messaging' ? 'pb-20' : 'hidden'}>
              <MessagingTab />
            </div>
          )}

          {shouldRenderTab('campaigns') && (
            <div className={activeTab === 'campaigns' ? 'pb-20' : 'hidden'}>
              <CampaignsTab />
            </div>
          )}

          {shouldRenderTab('organisation-tools') && (
            <div className={activeTab === 'organisation-tools' ? 'pb-20' : 'hidden'}>
              <OrganizationTab />
            </div>
          )}

          {shouldRenderTab('impact') && (
            <div className={activeTab === 'impact' ? 'pb-20' : 'hidden'}>
              <CombinedImpactAnalyticsTab />
            </div>
          )}

          {shouldRenderTab('help-center') && (
            <div className={activeTab === 'help-center' ? 'pb-20' : 'hidden'}>
              <EnhancedHelpCenterTab />
            </div>
          )}

          {shouldRenderTab('profile') && (
            <div className={activeTab === 'profile' ? 'pb-20' : 'hidden'}>
              <ProfileTab />
            </div>
          )}
        </Suspense>
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
