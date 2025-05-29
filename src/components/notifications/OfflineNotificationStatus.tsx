
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  Check,
  Clock,
  HardDrive
} from "lucide-react";
import { useOfflineNotifications } from "@/hooks/useOfflineNotifications";

const OfflineNotificationStatus = () => {
  const {
    isOnline,
    lastSyncTime,
    pendingSyncCount,
    syncOfflineNotifications,
    retryFailedSync,
    clearCache,
    getStorageSize,
    notifications
  } = useOfflineNotifications();

  const failedCount = notifications.filter(n => n.syncStatus === 'failed').length;

  if (isOnline && pendingSyncCount === 0 && failedCount === 0) {
    return null; // Don't show when everything is synced
  }

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {pendingSyncCount > 0 && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{pendingSyncCount} pending</span>
              </Badge>
            )}

            {failedCount > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{failedCount} failed</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {lastSyncTime && (
              <span className="text-xs text-gray-500">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </span>
            )}

            {isOnline && pendingSyncCount > 0 && (
              <Button size="sm" variant="outline" onClick={syncOfflineNotifications}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync
              </Button>
            )}

            {failedCount > 0 && (
              <Button size="sm" variant="outline" onClick={retryFailedSync}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* Offline message */}
        {!isOnline && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <WifiOff className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  You're currently offline
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Notifications are being cached locally and will sync when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Storage info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <HardDrive className="h-3 w-3" />
            <span>Cache: {getStorageSize()}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCache}
            className="text-xs h-6 px-2"
          >
            Clear cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfflineNotificationStatus;
