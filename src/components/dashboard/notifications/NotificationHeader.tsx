
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Filter,
  Settings,
  CheckCircle
} from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  highPriorityCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationHeader = ({ 
  unreadCount, 
  highPriorityCount, 
  showFilters, 
  onToggleFilters, 
  onMarkAllAsRead 
}: NotificationHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <span className="font-semibold">Notifications</span>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
            {unreadCount}
          </Badge>
        )}
        {highPriorityCount > 0 && (
          <Badge className="bg-red-500 text-white text-xs px-2">
            {highPriorityCount} urgent
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="h-8 w-8 p-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
        {unreadCount > 0 && (
          <Button onClick={onMarkAllAsRead} variant="ghost" size="sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationHeader;
