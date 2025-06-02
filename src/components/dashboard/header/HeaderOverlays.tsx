
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Zap, Users, BarChart3, X } from "lucide-react";

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                <Badge variant="destructive">3</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">New connection request</p>
                  <p className="text-xs text-gray-600">John Doe wants to connect with you</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Help request completed</p>
                  <p className="text-xs text-gray-600">Your help with community garden was marked as complete</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium">New message</p>
                  <p className="text-xs text-gray-600">Jane Smith sent you a message</p>
                </div>
              </div>
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
