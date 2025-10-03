
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, MessageCircle, Target, Heart, Share2, Bell, Check, Trash2, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useHelpCompletion } from "@/hooks/useHelpCompletion";
import QuickConfirmDialog from "@/components/help-completion/QuickConfirmDialog";

interface Notification {
  id: string;
  type: "donation" | "campaign" | "message" | "social" | "system" | "help_completion_request" | string;
  title: string;
  message: string;
  timestamp?: string;
  created_at?: string;
  isRead?: boolean;
  is_read?: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    donorName?: string;
    campaignTitle?: string;
    senderName?: string;
    actionType?: string;
    request_id?: string;
    helperName?: string;
    helperAvatar?: string;
    postTitle?: string;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const [showQuickConfirm, setShowQuickConfirm] = useState(false);
  const { reviewCompletionRequest } = useHelpCompletion();

  const handleQuickConfirm = async () => {
    if (notification.type === 'help_completion_request' && notification.metadata?.request_id) {
      await reviewCompletionRequest(notification.metadata.request_id, {
        status: 'approved',
        feedback_rating: 5,
        feedback_message: 'Quick approved with 5 stars'
      });
      onMarkAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "donation":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "campaign":
        return <Target className="h-5 w-5 text-blue-600" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case "social":
        return <Users className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
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
        return `${metadata.donorName} donated £${metadata.amount} to "${metadata.campaignTitle}"`;
      case "social":
        return `${metadata.senderName} ${metadata.actionType} your post`;
      default:
        return notification.message;
    }
  };

  const isRead = notification.isRead || notification.is_read;
  const timestamp = notification.timestamp || notification.created_at;

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${!isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
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
                {!isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {formatMessage()}
              </p>
              
              {timestamp && (
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {!isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 h-auto"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="p-1 h-auto text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Quick Actions for Help Completion Requests */}
          {notification.type === 'help_completion_request' && notification.metadata?.request_id && (
            <div className="mt-2 flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowQuickConfirm(true)}
                className="text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirm ✓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = notification.actionUrl || '/dashboard?tab=help-approvals'}
                className="text-xs"
              >
                Review
              </Button>
            </div>
          )}

          {notification.actionUrl && notification.type !== 'help_completion_request' && (
            <div className="mt-2">
              <Button variant="outline" size="sm" className="text-xs">
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Confirm Dialog */}
      {notification.type === 'help_completion_request' && (
        <QuickConfirmDialog
          open={showQuickConfirm}
          onOpenChange={setShowQuickConfirm}
          helperName={notification.metadata?.helperName || 'Helper'}
          helperAvatar={notification.metadata?.helperAvatar}
          postTitle={notification.metadata?.postTitle || 'Help Request'}
          onConfirm={handleQuickConfirm}
        />
      )}
    </div>
  );
};

export default NotificationItem;
