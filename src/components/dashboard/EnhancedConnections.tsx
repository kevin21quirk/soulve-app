
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Users2, Heart, TrendingUp, Crown, Search, Filter, BarChart3 } from "lucide-react";
import { useRealConnections, useSuggestedConnections, useSendConnectionRequest, useRespondToConnection } from "@/services/realConnectionsService";
import PendingRequests from "./PendingRequests";
import ConnectedPeople from "./ConnectedPeople";
import SuggestedConnections from "./SuggestedConnections";
import GroupsSection from "./connections/GroupsSection";
import CampaignsSection from "./connections/CampaignsSection";
import PeopleYouMayKnow from "./connections/PeopleYouMayKnow";
import CommunityChampions from "./connections/CommunityChampions";
import ConnectionStats from "./connections/ConnectionStats";
import NetworkSearch from "./connections/NetworkSearch";
import NetworkAnalytics from "./connections/NetworkAnalytics";
import ConnectionInsights from "./connections/ConnectionInsights";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedConnections = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSearch, setShowSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Real database connections
  const { data: connections = [], isLoading: connectionsLoading } = useRealConnections();
  const { data: suggestedConnections = [], isLoading: suggestionsLoading } = useSuggestedConnections();
  const sendConnectionRequest = useSendConnectionRequest();
  const respondToConnection = useRespondToConnection();

  // Process connections data
  const pendingRequests = connections.filter(conn => 
    conn.status === 'pending' && conn.addressee_id === user?.id
  );
  
  const connectedPeople = connections
    .filter(conn => conn.status === 'accepted')
    .map(conn => ({
      id: conn.id,
      partner_id: conn.requester_id === user?.id ? conn.addressee_id : conn.requester_id,
      partner_profile: conn.requester_id === user?.id ? conn.addressee : conn.requester
    }));

  const handleAcceptConnection = (connectionId: string) => {
    respondToConnection.mutate({ connectionId, status: 'accepted' });
  };

  const handleDeclineConnection = (connectionId: string) => {
    respondToConnection.mutate({ connectionId, status: 'declined' });
  };

  const handleSendRequest = (userId: string) => {
    sendConnectionRequest.mutate(userId);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Mock data for sections not yet implemented
  const mockGroups = { myGroups: [], suggestedGroups: [] };
  const mockCampaigns = { campaigns: [] };
  const mockPeople = { peopleYouMayKnow: [] };
  const mockChampions = { champions: [] };

  if (connectionsLoading || suggestionsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Network</h2>
          <p className="text-gray-600">Build trust and connections within your community</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>

      {showSearch && (
        <NetworkSearch
          connections={connectedPeople}
          suggestedConnections={suggestedConnections}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showAnalytics && (
        <NetworkAnalytics
          connectedPeople={connectedPeople}
          myGroups={mockGroups.myGroups}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-transparent border-none p-2 gap-2 rounded-lg h-auto">
          <TabsTrigger value="overview" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Connections</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <Users2 className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger value="champions" className="flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Champions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ConnectionStats
            totalConnections={connectedPeople.length}
            pendingRequests={pendingRequests.length}
            groupsJoined={0}
            campaignsActive={0}
            weeklyGrowth={12}
          />

          <ConnectionInsights
            connectedPeople={connectedPeople}
            suggestedConnections={suggestedConnections}
          />

          {pendingRequests.length > 0 && (
            <PendingRequests
              pendingRequests={pendingRequests}
              onAccept={handleAcceptConnection}
              onDecline={handleDeclineConnection}
              getTrustScoreColor={getTrustScoreColor}
            />
          )}

          {mockPeople.peopleYouMayKnow.length > 0 && (
            <PeopleYouMayKnow
              people={mockPeople.peopleYouMayKnow.slice(0, 3)}
              onSendRequest={() => {}}
              onDismiss={() => {}}
            />
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          {pendingRequests.length > 0 && (
            <PendingRequests
              pendingRequests={pendingRequests}
              onAccept={handleAcceptConnection}
              onDecline={handleDeclineConnection}
              getTrustScoreColor={getTrustScoreColor}
            />
          )}

          <ConnectedPeople
            connectedPeople={connectedPeople}
            getTrustScoreColor={getTrustScoreColor}
          />

          <SuggestedConnections
            suggestedConnections={suggestedConnections}
            onSendRequest={handleSendRequest}
            getTrustScoreColor={getTrustScoreColor}
          />
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <GroupsSection
            suggestedGroups={mockGroups.suggestedGroups}
            myGroups={mockGroups.myGroups}
            onJoinGroup={() => {}}
            onLeaveGroup={() => {}}
          />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsSection
            campaigns={mockCampaigns.campaigns}
            onJoinCampaign={() => {}}
            onLeaveCampaign={() => {}}
          />
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <SuggestedConnections
            suggestedConnections={suggestedConnections}
            onSendRequest={handleSendRequest}
            getTrustScoreColor={getTrustScoreColor}
          />
        </TabsContent>

        <TabsContent value="champions" className="space-y-6">
          <CommunityChampions
            champions={mockChampions.champions}
            onFollowChampion={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedConnections;
