
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Settings, 
  Download, 
  Filter, 
  X 
} from "lucide-react";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useOfflineNotifications } from "@/hooks/useOfflineNotifications";
import NotificationCenterHeader from "./NotificationCenterHeader";
import NotificationList from "./NotificationList";
import NotificationSettings from "./NotificationSettings";
import ActivityExport from "./ActivityExport";
import AdvancedNotificationFilters from "./AdvancedNotificationFilters";
import OfflineNotificationStatus from "./OfflineNotificationStatus";

interface EnhancedNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DateRangeFilter {
  preset: string;
  from?: Date;
  to?: Date;
}

interface AdvancedFilters {
  dateRange: DateRangeFilter;
  categories: string[];
  priority: string[];
  readStatus: string;
  amountRange: [number, number];
  location: string;
  keywords: string[];
  source: string[];
  engagement: {
    minLikes: number;
    minComments: number;
    minShares: number;
  };
}

const EnhancedNotificationCenter = ({ isOpen, onClose }: EnhancedNotificationCenterProps) => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const {
    notifications: onlineNotifications,
    unreadCount: onlineUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications
  } = useRealTimeNotifications();

  const offlineNotifications = useOfflineNotifications();

  // Combine online and offline notifications
  const allNotifications = [
    ...onlineNotifications,
    ...offlineNotifications.notifications
  ].sort((a, b) => new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime());

  const totalUnreadCount = onlineUnreadCount + offlineNotifications.unreadCount;

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    dateRange: { preset: "all" },
    categories: [],
    priority: [],
    readStatus: "all",
    amountRange: [0, 10000],
    location: "",
    keywords: [],
    source: [],
    engagement: {
      minLikes: 0,
      minComments: 0,
      minShares: 0
    }
  });

  const applyAdvancedFilters = (notifications: any[]) => {
    let filtered = [...notifications];

    // Apply date range filter
    if (advancedFilters.dateRange.preset !== "all" && advancedFilters.dateRange.from) {
      filtered = filtered.filter(notification => {
        const notificationDate = new Date(notification.created_at || notification.timestamp);
        const fromDate = advancedFilters.dateRange.from;
        const toDate = advancedFilters.dateRange.to || new Date();
        return fromDate && notificationDate >= fromDate && notificationDate <= toDate;
      });
    }

    // Apply category filter
    if (advancedFilters.categories.length > 0) {
      filtered = filtered.filter(notification => 
        advancedFilters.categories.includes(notification.type)
      );
    }

    // Apply read status filter
    if (advancedFilters.readStatus !== "all") {
      filtered = filtered.filter(notification => 
        advancedFilters.readStatus === "read" ? (notification.isRead || notification.is_read) : !(notification.isRead || notification.is_read)
      );
    }

    // Apply keyword filter
    if (advancedFilters.keywords.length > 0) {
      filtered = filtered.filter(notification =>
        advancedFilters.keywords.some(keyword =>
          notification.title.toLowerCase().includes(keyword.toLowerCase()) ||
          notification.message.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    // Apply location filter
    if (advancedFilters.location) {
      filtered = filtered.filter(notification =>
        notification.metadata?.location?.toLowerCase().includes(advancedFilters.location.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredNotifications = applyAdvancedFilters(allNotifications);

  if (!isOpen) return null;

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <NotificationSettings onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  if (showExport) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <ActivityExport 
          notifications={allNotifications}
          activities={[]} // Would be populated from activity feed
        />
        <Button 
          variant="ghost" 
          className="absolute top-4 right-4"
          onClick={() => setShowExport(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (showAdvancedFilters) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <AdvancedNotificationFilters
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Activity Center</h2>
              {totalUnreadCount > 0 && (
                <Badge variant="destructive">{totalUnreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvancedFilters(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowExport(true)}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <OfflineNotificationStatus />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
              <TabsTrigger value="notifications">
                Notifications ({filteredNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="activity">
                Activity Feed
              </TabsTrigger>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="mt-0">
              <div className="max-h-[50vh] overflow-y-auto">
                <NotificationList
                  notifications={filteredNotifications}
                  onMarkAsRead={(id) => {
                    markAsRead(id);
                    offlineNotifications.markAsRead(id);
                  }}
                  onDelete={(id) => {
                    deleteNotification(id);
                    offlineNotifications.deleteNotification(id);
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Activity feed integration coming soon...
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Activity insights and analytics coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedNotificationCenter;
