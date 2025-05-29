
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Bell, Check, X, Settings } from "lucide-react";

interface NotificationCenterHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const NotificationCenterHeader = ({ 
  unreadCount, 
  onMarkAllAsRead, 
  onClose 
}: NotificationCenterHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <CardTitle>Notifications</CardTitle>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount}</Badge>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
          <Check className="h-4 w-4 mr-1" />
          Mark All Read
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenterHeader;
