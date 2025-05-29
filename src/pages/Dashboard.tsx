import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ErrorBoundary from "@/components/ui/error-boundary";
import { MobileContainer } from "@/components/ui/mobile/mobile-layout";
import { useDashboardShortcuts } from "@/hooks/useDashboardShortcuts";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileDashboard from "@/components/mobile/MobileDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const isMobile = useIsMobile();

  // Setup keyboard shortcuts
  useDashboardShortcuts({
    setActiveTab,
    setShowSearch,
    setShowNotifications,
    setShowShortcuts,
    setShowActivity,
  });

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Render mobile version for mobile devices
  if (isMobile) {
    return (
      <ErrorBoundary>
        <MobileDashboard />
      </ErrorBoundary>
    );
  }

  // Render desktop version for desktop devices (unchanged)
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
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

        <MobileContainer className="py-8">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </MobileContainer>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
