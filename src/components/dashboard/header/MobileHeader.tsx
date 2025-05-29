
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
}: MobileHeaderProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

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
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileHeader;
