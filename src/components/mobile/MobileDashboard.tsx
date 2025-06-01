
import { useState } from "react";
import MobileNavigation from "./MobileNavigation";
import MobileFeed from "./MobileFeed";
import MobileDiscover from "./MobileDiscover";
import MobileMessaging from "./MobileMessaging";
import MobileNotifications from "./MobileNotifications";
import MobileAnalyticsPoints from "./MobileAnalyticsPoints";
import MobileMenu from "./MobileMenu";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <MobileFeed />;
      case "discover":
        return <MobileDiscover />;
      case "messaging":
        return <MobileMessaging />;
      case "notifications":
        return <MobileNotifications />;
      case "points":
        return <MobileAnalyticsPoints />;
      case "menu":
        return <MobileMenu />;
      default:
        return <MobileFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {renderContent()}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
