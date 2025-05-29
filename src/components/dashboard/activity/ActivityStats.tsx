
import { TrendingUp } from "lucide-react";
import { ActivityItem, formatTimeAgo } from "./ActivityTypes";

interface ActivityStatsProps {
  activities: ActivityItem[];
}

const ActivityStats = ({ activities }: ActivityStatsProps) => {
  return (
    <div className="p-3 border-t bg-gray-50">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: {formatTimeAgo(new Date())}</span>
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>{activities.filter(a => a.isNew).length} new</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;
