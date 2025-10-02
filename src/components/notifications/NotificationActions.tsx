import { Button } from "@/components/ui/button";
import { Check, X, Reply, Eye, Heart, Share2 } from "lucide-react";
import { NotificationActionType } from "@/types/notifications";

interface NotificationActionsProps {
  notificationId: string;
  actionType?: NotificationActionType;
  actionUrl?: string;
  onAction: (notificationId: string, action: NotificationActionType) => void;
  compact?: boolean;
}

export const NotificationActions = ({
  notificationId,
  actionType,
  actionUrl,
  onAction,
  compact = false
}: NotificationActionsProps) => {
  const getActionButton = () => {
    switch (actionType) {
      case 'accept':
        return (
          <>
            <Button
              size={compact ? "sm" : "default"}
              variant="default"
              onClick={() => onAction(notificationId, 'accept')}
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              size={compact ? "sm" : "default"}
              variant="outline"
              onClick={() => onAction(notificationId, 'decline')}
            >
              <X className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </>
        );
      case 'reply':
        return (
          <Button
            size={compact ? "sm" : "default"}
            variant="default"
            onClick={() => onAction(notificationId, 'reply')}
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
        );
      case 'view':
        return (
          <Button
            size={compact ? "sm" : "default"}
            variant="default"
            onClick={() => onAction(notificationId, 'view')}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        );
      case 'like':
        return (
          <Button
            size={compact ? "sm" : "default"}
            variant="outline"
            onClick={() => onAction(notificationId, 'like')}
          >
            <Heart className="w-4 h-4 mr-1" />
            Like
          </Button>
        );
      case 'share':
        return (
          <Button
            size={compact ? "sm" : "default"}
            variant="outline"
            onClick={() => onAction(notificationId, 'share')}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        );
      default:
        return null;
    }
  };

  if (!actionType && !actionUrl) return null;

  return (
    <div className="flex gap-2 mt-2">
      {getActionButton()}
    </div>
  );
};
