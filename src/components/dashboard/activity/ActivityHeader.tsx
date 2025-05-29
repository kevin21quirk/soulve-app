
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Activity, Bell, BellOff, Filter } from "lucide-react";

interface ActivityHeaderProps {
  isLiveEnabled: boolean;
  onToggleLive: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const ActivityHeader = ({ 
  isLiveEnabled, 
  onToggleLive, 
  showFilters, 
  onToggleFilters 
}: ActivityHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center space-x-2">
        <Activity className="h-5 w-5" />
        <span>Live Activity</span>
        <Badge 
          variant="secondary" 
          className={`animate-pulse ${isLiveEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {isLiveEnabled ? 'LIVE' : 'PAUSED'}
        </Badge>
      </CardTitle>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLive}
          className="h-8 w-8 p-0"
        >
          {isLiveEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="h-8 w-8 p-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityHeader;
