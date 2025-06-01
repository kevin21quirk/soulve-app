
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSearchBar from "./UserSearchBar";
import UserSearchResults from "./UserSearchResults";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useRealConnections, useSuggestedConnections } from "@/services/realConnectionsService";
import { Search, Users, Sparkles } from "lucide-react";

interface EnhancedUserDiscoveryProps {
  onUserClick?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

const EnhancedUserDiscovery = ({ onUserClick, onMessage }: EnhancedUserDiscoveryProps) => {
  const [activeTab, setActiveTab] = useState("search");
  
  const {
    searchResults,
    isLoading: searchLoading,
    filters,
    searchQuery,
    updateFilters,
    clearFilters,
    handleSearch,
    filterOptions
  } = useUserSearch();

  const { data: suggestedUsers = [], isLoading: suggestionsLoading } = useSuggestedConnections();
  const { data: connections = [] } = useRealConnections();

  // Transform suggested users to match SearchedUser interface
  const transformedSuggestions = suggestedUsers.map(user => ({
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    avatar_url: user.avatar_url,
    location: user.location,
    bio: user.bio,
    skills: user.skills || [],
    interests: user.interests || []
  }));

  // Filter out users we're already connected to
  const connectedUserIds = new Set(
    connections
      .filter(conn => conn.status === 'accepted')
      .map(conn => conn.requester?.id === conn.addressee?.id ? 
           conn.addressee?.id : conn.requester?.id)
      .filter(Boolean)
  );

  const filteredSuggestions = transformedSuggestions.filter(
    user => !connectedUserIds.has(user.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Discover People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Users
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Suggestions ({filteredSuggestions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <UserSearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                filters={filters}
                onFiltersChange={updateFilters}
                filterOptions={filterOptions}
                onClearFilters={clearFilters}
              />
              
              <UserSearchResults
                users={searchResults}
                isLoading={searchLoading}
                onUserClick={onUserClick}
                onMessage={onMessage}
              />
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {filteredSuggestions.length > 0 ? (
                <>
                  <div className="text-sm text-gray-600 mb-4">
                    People you might know based on shared interests, location, and mutual connections.
                  </div>
                  <UserSearchResults
                    users={filteredSuggestions}
                    isLoading={suggestionsLoading}
                    onUserClick={onUserClick}
                    onMessage={onMessage}
                  />
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
                    <p className="text-gray-500">
                      Complete your profile with skills and interests to get better suggestions.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserDiscovery;
