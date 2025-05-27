
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Check, 
  X, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Users, 
  Star,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  Clock,
  MoreHorizontal,
  Bell,
  AlertCircle
} from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "comment" | "connection" | "help_request" | "achievement" | "mention" | "share" | "follow" | "group_invite" | "event" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  avatar?: string;
  userName?: string;
  groupId?: string;
  actionRequired?: boolean;
  metadata?: {
    postId?: string;
    connectionId?: string;
    eventId?: string;
    url?: string;
    previewImage?: string;
    groupCount?: number;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction: (notification: Notification, action: "accept" | "decline" | "view") => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDismiss, onAction }: NotificationItemProps) => {
  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === "high" ? "text-red-500" : priority === "medium" ? "text-orange-500" : "text-gray-500";
    
    switch (type) {
      case "like": return <Heart className={`h-4 w-4 ${iconClass}`} />;
      case "comment": return <MessageSquare className={`h-4 w-4 ${iconClass}`} />;
      case "connection": return <UserPlus className={`h-4 w-4 ${iconClass}`} />;
      case "help_request": return <Users className={`h-4 w-4 ${iconClass}`} />;
      case "achievement": return <Star className="h-4 w-4 text-yellow-500" />;
      case "mention": return <Bell className={`h-4 w-4 ${iconClass}`} />;
      case "share": return <Share2 className={`h-4 w-4 ${iconClass}`} />;
      case "follow": return <UserPlus className={`h-4 w-4 ${iconClass}`} />;
      case "group_invite": return <Users className={`h-4 w-4 ${iconClass}`} />;
      case "event": return <Calendar className={`h-4 w-4 ${iconClass}`} />;
      case "system": return <AlertCircle className={`h-4 w-4 ${iconClass}`} />;
      default: return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />;
      case "medium": return <Badge className="h-2 w-2 p-0 rounded-full bg-orange-500" />;
      case "low": return <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />;
      default: return null;
    }
  };

  const getNotificationBackground = (notification: Notification) => {
    if (!notification.read) {
      switch (notification.priority) {
        case "high": return "bg-red-50 border-l-4 border-l-red-500";
        case "medium": return "bg-orange-50 border-l-4 border-l-orange-500";
        default: return "bg-blue-50 border-l-4 border-l-blue-500";
      }
    }
    return "bg-white hover:bg-gray-50";
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 transition-all duration-200 ${getNotificationBackground(notification)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="relative">
            {notification.avatar || notification.userName ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.avatar} />
                <AvatarFallback className="text-xs">
                  {notification.userName?.split(' ').map(n => n[0]).join('') || 'SY'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="p-2 rounded-full bg-gray-100">
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
              {getNotificationIcon(notification.type, notification.priority)}
            </div>
            {!notification.read && (
              <div className="absolute -top-1 -left-1">
                {getPriorityBadge(notification.priority)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </h4>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">{notification.timestamp}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {notification.description}
            </p>

            {notification.actionRequired && (
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => onAction(notification, "accept")}
                  className="h-7 px-3 text-xs"
                >
                  {notification.type === "connection" ? "Accept" : "Join"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(notification, "decline")}
                  className="h-7 px-3 text-xs"
                >
                  {notification.type === "connection" ? "Decline" : "Ignore"}
                </Button>
              </div>
            )}

            {!notification.actionRequired && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction(notification, "view")}
                className="h-6 px-2 text-xs mt-2"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          {!notification.read && (
            <Button
              onClick={() => onMarkAsRead(notification.id)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => onDismiss(notification.id)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
