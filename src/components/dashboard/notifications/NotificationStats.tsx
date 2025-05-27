
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface NotificationStatsProps {
  unreadCount: number;
}

const NotificationStats = ({ unreadCount }: NotificationStatsProps) => {
  return (
    <div className="p-3 border-t bg-gray-50">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        </span>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;
