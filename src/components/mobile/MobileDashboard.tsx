
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFeed from "./MobileFeed";
import MobileDiscover from "./MobileDiscover";
import MobileMessaging from "./MobileMessaging";
import MobileActivity from "./MobileActivity";
import MobileAnalyticsPoints from "./MobileAnalyticsPoints";
import MobileMenu from "./MobileMenu";
import MobileNavigation from "./MobileNavigation";
import MobileHeader from "./MobileHeader";
import UserProfile from "@/components/dashboard/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { toast } = useToast();

  // Only render on mobile
  if (!isMobile) return null;

  const handleNavigateToProfile = () => {
    setActiveTab("profile");
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - only show on certain tabs */}
      {!["menu", "profile"].includes(activeTab) && (
        <MobileHeader onNavigateToProfile={handleNavigateToProfile} />
      )}
      
      {/* Main Content */}
      <main className="pb-20">
        {activeTab === "feed" && <MobileFeed />}
        {activeTab === "discover" && <MobileDiscover />}
        {activeTab === "messaging" && <MobileMessaging />}
        {activeTab === "notifications" && <MobileActivity />}
        {activeTab === "analytics-points" && <MobileAnalyticsPoints />}
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "menu" && (
          <MobileMenu 
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToTab={handleNavigateToTab}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
