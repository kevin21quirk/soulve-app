
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const context = searchParams.get('context') || 'personal';
  const orgId = searchParams.get('orgId');
  const activeTab = useMemo(() => {
    return searchParams.get("tab") || "feed";
  }, [searchParams]);
  const [currentOrgName, setCurrentOrgName] = useState<string>('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  
  // Header overlay states
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Load organization name if in org context
  useEffect(() => {
    const loadOrgName = async () => {
      if (context === 'org' && orgId) {
        const { data } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', orgId)
          .single();
        if (data) setCurrentOrgName(data.name);
      }
    };
    loadOrgName();
  }, [context, orgId]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      // Skip if already checked to prevent re-runs on token refresh
      if (onboardingChecked) return;

      try {
        const { data } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const completed = !!data;
        setHasCompletedOnboarding(completed);
        setOnboardingChecked(true);

        if (!completed) {
          navigate('/profile-registration', { replace: true });
          return;
        }

        // Show welcome message for new users
        if (completed && !localStorage.getItem('welcomeShown')) {
          setTimeout(() => {
            toast({
              title: "Welcome to SouLVE! 🎉",
              description: "Your community dashboard is ready. Start exploring and making connections!",
            });
            localStorage.setItem('welcomeShown', 'true');
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to allowing access if there's an error
        setHasCompletedOnboarding(true);
        setOnboardingChecked(true);
      }
    };

    if (!loading && user?.id) {
      checkOnboardingStatus();
    }
  }, [user?.id, loading, toast, navigate, onboardingChecked]);

  const handleNavigateToTab = (tab: string) => {
    setSearchParams({ tab, context, ...(orgId ? { orgId } : {}) });
    // Close any open overlays when navigating
    setShowSearch(false);
    setShowShortcuts(false);
    setShowActivity(false);
  };

  // Show loading while checking onboarding status
  if (loading || hasCompletedOnboarding === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if user hasn't completed onboarding
  if (!hasCompletedOnboarding) {
    return null;
  }

  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <main className={activeTab === 'messaging' ? 'flex flex-col h-[calc(100vh-64px)]' : 'container mx-auto px-4 py-6'}>
        <DashboardTabs 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setSearchParams({ tab, context, ...(orgId ? { orgId } : {}) });
          }}
          organizationId={context === 'org' ? orgId : null}
        />
      </main>
    </div>
  );
};

export default Dashboard;
