
import { Button } from "@/components/ui/button";
import SearchBar from "../SearchBar";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import KeyboardShortcuts from "../KeyboardShortcuts";
import RealTimeActivity from "../RealTimeActivity";

interface HeaderOverlaysProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
  onSearchSubmit: (query: string) => void;
}

const HeaderOverlays = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  onSearchSubmit,
}: HeaderOverlaysProps) => {
  return (
    <>
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
              onSearch={onSearchSubmit}
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
            <NotificationCenter 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
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

export default HeaderOverlays;
