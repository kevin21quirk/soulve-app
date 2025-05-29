
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NotificationCenterHeader from "./NotificationCenterHeader";
import NotificationTabs from "./NotificationTabs";
import NotificationList from "./NotificationList";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications
  } = useRealTimeNotifications();

  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);

  useEffect(() => {
    setFilteredNotifications(filterNotifications(activeFilter));
  }, [notifications, activeFilter, filterNotifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <NotificationCenterHeader
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
            onClose={onClose}
          />
        </CardHeader>

        <CardContent className="p-0">
          <NotificationTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            notifications={notifications}
          >
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </NotificationTabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
