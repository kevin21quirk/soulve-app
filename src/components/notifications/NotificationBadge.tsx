
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
  className?: string;
}

const NotificationBadge = ({ count, onClick, className = "" }: NotificationBadgeProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`relative p-2 ${className}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBadge;
