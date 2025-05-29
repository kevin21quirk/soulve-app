
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, Keyboard, Activity, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "./SearchBar";
import NotificationCenter from "./NotificationCenter";
import KeyboardShortcuts from "./KeyboardShortcuts";
import RealTimeActivity from "./RealTimeActivity";

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
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-teal-600">SouLVE</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="relative"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Shortcuts */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
              >
                <Keyboard className="h-5 w-5" />
              </Button>

              {/* Activity */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActivity(!showActivity)}
              >
                <Activity className="h-5 w-5" />
              </Button>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-1 hidden sm:inline">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <SearchBar onClose={() => setShowSearch(false)} />
      )}

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter 
          onClose={() => setShowNotifications(false)}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* Keyboard Shortcuts */}
      {showShortcuts && (
        <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
      )}

      {/* Real-time Activity */}
      {showActivity && (
        <RealTimeActivity onClose={() => setShowActivity(false)} />
      )}
    </>
  );
};

export default DashboardHeader;
