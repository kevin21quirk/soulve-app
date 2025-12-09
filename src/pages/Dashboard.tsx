import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import PersonalizedWelcome from "@/components/dashboard/PersonalizedWelcome";
import { LoadingState } from "@/components/ui/loading-state";
import { preloadTabBundles, prefetchCriticalData } from "@/hooks/usePrefetchTabData";
import { GlobalPostComposer } from "@/components/post-creation/GlobalPostComposer";
const Dashboard = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
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

  // Preload tab bundles and critical data on mount
  useEffect(() => {
    preloadTabBundles();
    prefetchCriticalData(queryClient);
  }, [queryClient]);
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
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader 
        showSearch={showSearch} 
        setShowSearch={setShowSearch} 
        showShortcuts={showShortcuts} 
        setShowShortcuts={setShowShortcuts} 
        showActivity={showActivity} 
        setShowActivity={setShowActivity} 
        onNavigateToTab={handleNavigateToTab} 
        context={context} 
        orgId={orgId || undefined} 
        orgName={currentOrgName} 
      />
      
      <main className="container mx-auto px-4 py-2">
        {/* Personalized welcome based on user type */}
        {context === 'personal' && (
          <PersonalizedWelcome onNavigateToTab={handleNavigateToTab} />
        )}
        
        <DashboardTabs 
          activeTab={activeTab} 
          onTabChange={tab => {
            setSearchParams({
              tab,
              context,
              ...(orgId ? { orgId } : {})
            });
          }} 
          organizationId={context === 'org' ? orgId : null} 
        />
      </main>
      
      {/* Global Post Composer - accessible from quick action buttons */}
      <GlobalPostComposer />
    </div>
  );
};

export default Dashboard;