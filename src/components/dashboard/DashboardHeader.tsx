
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

  const handleSearchSubmit = (query: string) => {
    // Handle search functionality here
    console.log("Search query:", query);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(false)}
              >
                ✕
              </Button>
            </div>
            <SearchBar 
              onSearch={handleSearchSubmit}
              placeholder="Search posts, people, groups..."
            />
          </div>
        </div>
      )}

      {/* Notification Center */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(false)}
              className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-white shadow-md"
            >
              ✕
            </Button>
            <NotificationCenter />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(false)}
              className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-white shadow-md"
            >
              ✕
            </Button>
            <KeyboardShortcuts />
          </div>
        </div>
      )}

      {/* Real-time Activity */}
      {showActivity && (
        <div className="fixed top-16 right-4 z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActivity(false)}
              className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-white shadow-md"
            >
              ✕
            </Button>
            <RealTimeActivity />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
