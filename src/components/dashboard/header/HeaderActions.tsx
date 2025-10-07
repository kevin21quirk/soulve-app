
import { Search, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
}

const HeaderActions = ({
  showSearch,
  setShowSearch,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSearch(!showSearch)}
        className="p-2"
        title="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="p-2"
        title="Quick Actions"
      >
        <Zap className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowActivity(!showActivity)}
        className="p-2"
        title="Recent Activity"
      >
        <Activity className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeaderActions;
