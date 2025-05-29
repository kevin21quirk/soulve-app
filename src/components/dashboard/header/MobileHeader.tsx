
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Target, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderLogo from "./HeaderLogo";
import HeaderActions from "./HeaderActions";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface MobileHeaderProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
  unreadCount?: number;
  onNotificationClick?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const MobileHeader = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  unreadCount = 0,
  onNotificationClick,
  onNavigateToTab,
}: MobileHeaderProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

  const handleTabNavigation = (tab: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <HeaderLogo />
      
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {/* Quick Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-12"
                  onClick={() => handleTabNavigation("campaigns")}
                >
                  <Target className="h-4 w-4" />
                  Campaigns
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-12"
                  onClick={() => handleTabNavigation("analytics-points")}
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>

            {/* Header Actions */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
              <HeaderActions
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                showShortcuts={showShortcuts}
                setShowShortcuts={setShowShortcuts}
                showActivity={showActivity}
                setShowActivity={setShowActivity}
                unreadCount={unreadCount}
                onNotificationClick={onNotificationClick}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileHeader;
