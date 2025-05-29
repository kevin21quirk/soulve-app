
import { useNavigate } from "react-router-dom";
import { Plus, BarChart3, HelpCircle, MessageCircle } from "lucide-react";
import HeaderLogo from "./header/HeaderLogo";
import HeaderActions from "./header/HeaderActions";
import UserSection from "./header/UserSection";
import HeaderOverlays from "./header/HeaderOverlays";

interface DashboardHeaderProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
  onNavigateToTab: (tab: string) => void;
}

const DashboardHeader = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  onNavigateToTab,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleSearchSubmit = (query: string) => {
    // Handle search functionality here
    console.log("Search query:", query);
  };

  const quickActions = [
    { label: "Create Campaign", action: () => navigate('/campaign-builder'), icon: Plus },
    { label: "View Analytics", action: () => onNavigateToTab("analytics-points"), icon: BarChart3 },
    { label: "Help Center", action: () => onNavigateToTab("help-center"), icon: HelpCircle },
    { label: "Messages", action: () => onNavigateToTab("messaging"), icon: MessageCircle },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <HeaderLogo />

            <div className="flex items-center space-x-4">
              <HeaderActions
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                showShortcuts={showShortcuts}
                setShowShortcuts={setShowShortcuts}
                showActivity={showActivity}
                setShowActivity={setShowActivity}
              />

              <UserSection />
            </div>
          </div>
        </div>
      </header>

      <HeaderOverlays
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        showActivity={showActivity}
        setShowActivity={setShowActivity}
        onSearchSubmit={handleSearchSubmit}
      />
    </>
  );
};

export default DashboardHeader;
