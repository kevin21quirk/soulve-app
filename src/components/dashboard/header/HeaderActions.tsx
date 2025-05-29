
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Keyboard, Activity } from "lucide-react";

interface HeaderActionsProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
}

const HeaderActions = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
}: HeaderActionsProps) => {
  return (
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
    </div>
  );
};

export default HeaderActions;
