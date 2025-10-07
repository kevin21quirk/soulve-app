
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Zap, Users, BarChart3, X, Activity as ActivityIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useUserActivity } from "@/hooks/useUserActivity";
import GlobalSearchResults from "@/components/dashboard/search/GlobalSearchResults";
import { formatDistanceToNow } from "date-fns";

interface HeaderOverlaysProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
  onNavigateToTab?: (tab: string) => void;
}

const HeaderOverlays = ({
  showSearch,
  setShowSearch,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
  onNavigateToTab,
}: HeaderOverlaysProps) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { query, setQuery, results, loading, error, clearSearch } = useGlobalSearch();
  const { activities, loading: activitiesLoading } = useUserActivity();

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchClose = () => {
    setShowSearch(false);
    clearSearch();
  };

  return (
    <>
      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  placeholder="Search users, campaigns, groups, organizations, posts..."
                  value={query}
                  onChange={(e) => {
                    console.log('🔍 [Search Input] Value changed:', e.target.value);
                    setQuery(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              <Button variant="ghost" onClick={handleSearchClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {loading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            {!loading && !error && query.length >= 2 && (
              <GlobalSearchResults 
                results={results} 
                loading={loading}
                query={query}
                onResultClick={handleSearchClose}
              />
            )}
            
            {!loading && query.length > 0 && query.length < 2 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Shortcuts Overlay */}
      {showShortcuts && (
        <div className="absolute top-16 right-0 w-64 bg-background border shadow-lg rounded-lg z-40 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/campaign-builder');
                    setShowShortcuts(false);
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setShowSearch(true);
                    setShowShortcuts(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Find People
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab('impact-analytics');
                    setShowShortcuts(false);
                  }}
                >
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
        <div className="absolute top-16 right-0 w-80 bg-background border shadow-lg rounded-lg z-40 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowActivity(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {activitiesLoading ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center">
                  <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="text-sm border-b pb-3 last:border-0">
                      <p className="font-medium">{activity.title}</p>
                      {activity.description && (
                        <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
                      )}
                      <p className="text-muted-foreground text-xs mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HeaderOverlays;
