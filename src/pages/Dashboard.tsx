import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import { LoadingState } from "@/components/ui/loading-state";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const context = searchParams.get('context') || 'personal';
  const orgId = searchParams.get('orgId');
  const activeTab = useMemo(() => {
    return searchParams.get("tab") || "feed";
  }, [searchParams]);
  const [currentOrgName, setCurrentOrgName] = useState<string>('');

  // Header overlay states
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Load organization name if in org context
  useEffect(() => {
    const loadOrgName = async () => {
      if (context === 'org' && orgId) {
        const { data } = await supabase.from('organizations').select('name').eq('id', orgId).single();
        if (data) setCurrentOrgName(data.name);
      }
    };
    loadOrgName();
  }, [context, orgId]);
  const handleNavigateToTab = (tab: string) => {
    setSearchParams({
      tab,
      context,
      ...(orgId ? { orgId } : {})
    });
    // Close any open overlays when navigating
    setShowSearch(false);
    setShowShortcuts(false);
    setShowActivity(false);
  };

  // Show loading state - NEVER return null
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingState message="Loading your dashboard..." size="lg" />
      </div>
    );
  }
  if (isMobile) {
    return <MobileDashboard />;
  }
  return <div className="min-h-screen bg-gray-50">
      <DashboardHeader showSearch={showSearch} setShowSearch={setShowSearch} showShortcuts={showShortcuts} setShowShortcuts={setShowShortcuts} showActivity={showActivity} setShowActivity={setShowActivity} onNavigateToTab={handleNavigateToTab} context={context} orgId={orgId || undefined} orgName={currentOrgName} />
      
      <main className="container mx-auto px-4 py-2 ">
        <DashboardTabs activeTab={activeTab} onTabChange={tab => {
        setSearchParams({
          tab,
          context,
          ...(orgId ? {
            orgId
          } : {})
        });
      }} organizationId={context === 'org' ? orgId : null} />
      </main>
    </div>;
};
export default Dashboard;