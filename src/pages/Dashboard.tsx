
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import MobileDashboard from "@/components/mobile/MobileDashboard";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("feed");
  
  // Header overlay states
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
    // Close any open overlays when navigating
    setShowSearch(false);
    setShowNotifications(false);
    setShowShortcuts(false);
    setShowActivity(false);
  };

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
