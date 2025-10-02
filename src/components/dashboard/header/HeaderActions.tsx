
import { Search, Zap, Activity, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBadge from "@/components/notifications/NotificationBadge";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

interface HeaderActionsProps {
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

const HeaderActions = ({
  showSearch,
  setShowSearch,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  onNotificationClick,
}: HeaderActionsProps) => {
  // Use real-time notifications hook to get actual unread count
  const { unreadCount } = useRealtimeNotifications();

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSearch(!showSearch)}
        className="p-2"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNotificationClick}
        className="p-2 relative"
      >
        <Bell className="h-4 w-4" />
        <NotificationBadge count={unreadCount} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="p-2"
      >
        <Zap className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowActivity(!showActivity)}
        className="p-2"
      >
        <Activity className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeaderActions;
