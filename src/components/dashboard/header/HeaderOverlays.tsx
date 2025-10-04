
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Zap, Users, BarChart3, X, Clock, CheckCircle } from "lucide-react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useNavigate } from "react-router-dom";

interface HeaderOverlaysProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
  onSearchSubmit: (query: string) => void;
}

const HeaderOverlays = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  onSearchSubmit,
}: HeaderOverlaysProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useRealtimeNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchRef}
                  placeholder="Search people, posts, campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              <Button variant="ghost" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Overlay */}
      {showNotifications && (
        <div className="absolute top-16 right-0 w-80 bg-white border shadow-lg rounded-lg z-40 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
              </CardTitle>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.action_url) {
                          navigate(notification.action_url);
                          setShowNotifications(false);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {notification.type === 'volunteer_confirmation' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : notification.type === 'volunteer_confirmed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Bell className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 10 && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      navigate('/dashboard?tab=notifications');
                      setShowNotifications(false);
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shortcuts Overlay */}
      {showShortcuts && (
        <div className="absolute top-16 right-0 w-64 bg-white border shadow-lg rounded-lg z-40 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find People
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Overlay */}
      {showActivity && (
        <div className="absolute top-16 right-0 w-80 bg-white border shadow-lg rounded-lg z-40 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowActivity(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">You helped with community garden</p>
                  <p className="text-gray-600">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">New connection: Jane Smith</p>
                  <p className="text-gray-600">4 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Posted help request</p>
                  <p className="text-gray-600">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HeaderOverlays;
