
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEnhancedConnections } from "@/hooks/useEnhancedConnections";
import PendingRequests from "./PendingRequests";
import ConnectedPeople from "./ConnectedPeople";
import SuggestedConnections from "./SuggestedConnections";
import GroupsSection from "./connections/GroupsSection";
import CampaignsSection from "./connections/CampaignsSection";
import PeopleYouMayKnow from "./connections/PeopleYouMayKnow";
import CommunityChampions from "./connections/CommunityChampions";
import ConnectionStats from "./connections/ConnectionStats";
import DatabaseConnectionInsights from "./connections/DatabaseConnectionInsights";
import ConnectionsHeader from "./connections/ConnectionsHeader";
import ConnectionsOverlays from "./connections/ConnectionsOverlays";
import ConnectionsTabsList from "./connections/ConnectionsTabsList";

const EnhancedConnections = () => {
  const {
    activeTab,
    setActiveTab,
    showSearch,
    setShowSearch,
    showAnalytics,
    setShowAnalytics,
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    mockGroups,
    mockCampaigns,
    mockPeople,
    mockChampions,
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
    getTrustScoreColor,
    isLoading,
  } = useEnhancedConnections();

  if (isLoading) {
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
      <ConnectionsHeader
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
      />

      <ConnectionsOverlays
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        connectedPeople={connectedPeople}
        suggestedConnections={suggestedConnections}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ConnectionsTabsList activeTab={activeTab} />

        <TabsContent value="overview" className="space-y-6">
          <ConnectionStats
            totalConnections={connectedPeople.length}
            pendingRequests={pendingRequests.length}
            groupsJoined={0}
            campaignsActive={0}
            weeklyGrowth={12}
          />

          <DatabaseConnectionInsights
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
