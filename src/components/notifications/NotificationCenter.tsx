
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, DollarSign, Users, MessageCircle, Target, Check, X, Settings } from "lucide-react";
import NotificationItem from "./NotificationItem";
import NotificationFilters from "./NotificationFilters";
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

  const notificationTypes = [
    { id: "all", label: "All", icon: Bell, count: notifications.length },
    { id: "donations", label: "Donations", icon: DollarSign, count: notifications.filter(n => n.type === "donation").length },
    { id: "campaigns", label: "Campaigns", icon: Target, count: notifications.filter(n => n.type === "campaign").length },
    { id: "messages", label: "Messages", icon: MessageCircle, count: notifications.filter(n => n.type === "message").length },
    { id: "social", label: "Social", icon: Users, count: notifications.filter(n => n.type === "social").length },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
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
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
              {notificationTypes.map(type => (
                <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                  {type.count > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {type.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-h-[50vh] overflow-y-auto">
              {notificationTypes.map(type => (
                <TabsContent key={type.id} value={type.id} className="mt-0">
                  <div className="divide-y">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="font-medium mb-2">No notifications</h3>
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
