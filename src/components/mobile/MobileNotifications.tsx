
import { useState } from "react";
import { Bell, Filter, Settings, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import MobileNotificationItem from "./MobileNotificationItem";
import MobileNotificationFilters from "./MobileNotificationFilters";
import MobileNotificationSearch from "./MobileNotificationSearch";
import { MobileNotificationProps } from "@/types/notifications";

const MobileNotifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications
  } = useRealTimeNotifications();

  // Convert notifications to mobile format
  const convertToMobileFormat = (notification: any): MobileNotificationProps => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp || notification.created_at,
    created_at: notification.created_at,
    isRead: notification.isRead || notification.is_read,
    is_read: notification.is_read || notification.isRead,
    actionUrl: notification.actionUrl,
    metadata: notification.metadata
  });

  const filteredNotifications = filterNotifications(activeFilter)
    .map(convertToMobileFormat)
    .filter((notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getFilterCounts = () => {
    return {
      all: notifications.length,
      donation: notifications.filter(n => n.type === "donation").length,
      campaign: notifications.filter(n => n.type === "campaign").length,
      message: notifications.filter(n => n.type === "message").length,
      social: notifications.filter(n => n.type === "social").length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-700" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Activity</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={markAllAsRead}>
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Notification settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-3">
            <MobileNotificationSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={() => setShowSearch(false)}
            />
          </div>
        )}
      </div>

      {/* Filters */}
      <MobileNotificationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filterCounts={filterCounts}
      />

      {/* Notifications List */}
      <div className="px-4 py-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No matching notifications" : "All caught up!"}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "You have no new notifications"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <MobileNotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNotifications;
