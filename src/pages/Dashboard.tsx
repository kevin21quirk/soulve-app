
import { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("feed");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  
  // Header overlay states
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const completed = !!data || localStorage.getItem('onboardingCompleted') === 'true';
        setHasCompletedOnboarding(completed);

        if (!completed) {
          window.location.href = '/profile-registration';
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
      }
    };

    if (!loading && user) {
      checkOnboardingStatus();
    }
  }, [user, loading, toast]);

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
    // Close any open overlays when navigating
    setShowSearch(false);
    setShowNotifications(false);
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

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
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
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        showActivity={showActivity}
        setShowActivity={setShowActivity}
        onNavigateToTab={handleNavigateToTab}
      />
      
      <main className="container mx-auto px-4 py-6">
        <DashboardTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
