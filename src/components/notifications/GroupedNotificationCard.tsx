import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UnifiedNotification } from "@/types/notifications";
import { NotificationPriorityBadge } from "./NotificationPriorityBadge";
import { formatDistanceToNow } from "date-fns";

interface GroupedNotificationCardProps {
  notification: UnifiedNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GroupedNotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete
}: GroupedNotificationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!notification.isGroup) {
    return null;
  }

  const timestamp = notification.created_at || notification.timestamp;

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{notification.title}</h4>
            {notification.priority && (
              <NotificationPriorityBadge priority={notification.priority} />
            )}
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {notification.groupCount} notifications
            </span>
          </div>

          {!isExpanded && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
          )}

          {isExpanded && notification.groupedItems && (
            <div className="mt-3 space-y-2">
              {notification.groupedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-secondary/50 rounded-lg text-sm"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(item.created_at || item.timestamp || Date.now()), {
                      addSuffix: true
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {timestamp && (
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          {!notification.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark Read
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
