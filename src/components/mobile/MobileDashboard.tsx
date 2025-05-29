
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFeed from "./MobileFeed";
import MobileDiscover from "./MobileDiscover";
import MobileMessaging from "./MobileMessaging";
import MobileActivity from "./MobileActivity";
import MobileAnalyticsPoints from "./MobileAnalyticsPoints";
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
        {activeTab === "discover" && <MobileDiscover />}
        {activeTab === "messaging" && <MobileMessaging />}
        {activeTab === "notifications" && <MobileActivity />}
        {activeTab === "analytics-points" && <MobileAnalyticsPoints />}
        {activeTab === "profile" && <div className="p-4">Profile coming soon...</div>}
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
