
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

const NotificationBadge = ({ count, onClick }: NotificationBadgeProps) => {
  return (
    <button 
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </button>
  );
};

export default NotificationBadge;
