
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useDashboardShortcuts } from "@/hooks/useDashboardShortcuts";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
