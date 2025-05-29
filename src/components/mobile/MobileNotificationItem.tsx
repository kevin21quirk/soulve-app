
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  DollarSign, 
  Users, 
  MessageCircle, 
  Target, 
  Bell,
  MoreHorizontal,
  Check,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "donation" | "campaign" | "message" | "social" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    donorName?: string;
    campaignTitle?: string;
    senderName?: string;
    actionType?: string;
  };
}

interface MobileNotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const MobileNotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: MobileNotificationItemProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (notification.type) {
      case "donation":
        return <DollarSign className={`${iconClass} text-green-600`} />;
      case "campaign":
        return <Target className={`${iconClass} text-blue-600`} />;
      case "message":
        return <MessageCircle className={`${iconClass} text-purple-600`} />;
      case "social":
        return <Users className={`${iconClass} text-orange-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getBadgeColor = () => {
    switch (notification.type) {
      case "donation":
        return "bg-green-100 text-green-800";
      case "campaign":
        return "bg-blue-100 text-blue-800";
      case "message":
        return "bg-purple-100 text-purple-800";
      case "social":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatMessage = () => {
    const { metadata } = notification;
    if (!metadata) return notification.message;

    switch (notification.type) {
      case "donation":
        return `${metadata.donorName} donated $${metadata.amount} to "${metadata.campaignTitle}"`;
      case "social":
        return `${metadata.senderName} ${metadata.actionType} your post`;
      default:
        return notification.message;
    }
  };

  const getInitials = () => {
    if (notification.metadata?.donorName) {
      return notification.metadata.donorName.split(' ').map(n => n[0]).join('');
    }
    if (notification.metadata?.senderName) {
      return notification.metadata.senderName.split(' ').map(n => n[0]).join('');
    }
    return "N";
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 ${
        !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar or Icon */}
        <div className="flex-shrink-0">
          {notification.metadata?.donorName || notification.metadata?.senderName ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              {getIcon()}
            </div>
          )}
          {!notification.isRead && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.title}
                </p>
                <Badge className={`text-xs ${getBadgeColor()}`}>
                  {notification.type}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {formatMessage()}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
                
                {notification.metadata?.amount && (
                  <Badge variant="outline" className="text-xs">
                    ${notification.metadata.amount}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {!notification.isRead && (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="h-3 w-3 mr-2" />
                    Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Eye className="h-3 w-3 mr-2" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(notification.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-700 mb-2">
                Full message: {notification.message}
              </p>
              {notification.actionUrl && (
                <Button variant="outline" size="sm" className="text-xs">
                  View Details
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationItem;
