
import React from "react";
import NotificationItem from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";

interface NotificationListProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onDelete 
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  return (
    <div className="divide-y">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;
