
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFeed from "./MobileFeed";
import MobileNavigation from "./MobileNavigation";
import MobileHeader from "./MobileHeader";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const isMobile = useIsMobile();

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="pb-20">
        {activeTab === "feed" && <MobileFeed />}
        {activeTab === "discover" && <div className="p-4">Discover content coming soon...</div>}
        {activeTab === "messaging" && <div className="p-4">Messages coming soon...</div>}
        {activeTab === "notifications" && <div className="p-4">Activity & Notifications coming soon...</div>}
        {activeTab === "analytics-points" && <div className="p-4">Trust Score & Analytics coming soon...</div>}
        {activeTab === "profile" && <div className="p-4">Profile coming soon...</div>}
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
