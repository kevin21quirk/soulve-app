
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Users2, Heart, TrendingUp, Crown, Search, Filter, BarChart3 } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
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

const EnhancedConnections = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showSearch, setShowSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const {
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    myGroups,
    suggestedGroups,
    campaigns,
    peopleYouMayKnow,
    champions,
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
    handleJoinGroup,
    handleLeaveGroup,
    handleJoinCampaign,
    handleLeaveCampaign,
    handleSendPersonRequest,
    handleDismissPerson,
    handleFollowChampion,
    getTrustScoreColor,
  } = useConnections();

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
          myGroups={myGroups}
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
            groupsJoined={myGroups.length}
            campaignsActive={campaigns.filter(c => c.isParticipating).length}
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

          {peopleYouMayKnow.length > 0 && (
            <PeopleYouMayKnow
              people={peopleYouMayKnow.slice(0, 3)}
              onSendRequest={handleSendPersonRequest}
              onDismiss={handleDismissPerson}
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
            suggestedGroups={suggestedGroups}
            myGroups={myGroups}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
          />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsSection
            campaigns={campaigns}
            onJoinCampaign={handleJoinCampaign}
            onLeaveCampaign={handleLeaveCampaign}
          />
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <PeopleYouMayKnow
            people={peopleYouMayKnow}
            onSendRequest={handleSendPersonRequest}
            onDismiss={handleDismissPerson}
          />
        </TabsContent>

        <TabsContent value="champions" className="space-y-6">
          <CommunityChampions
            champions={champions}
            onFollowChampion={handleFollowChampion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedConnections;
