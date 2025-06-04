
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
import { useConnectionRequests } from "@/hooks/useConnectionRequests";

const EnhancedConnections = () => {
  const {
    activeTab,
    setActiveTab,
    showSearch,
    setShowSearch,
    showAnalytics,
    setShowAnalytics,
    mockGroups,
    mockCampaigns,
    mockPeople,
    mockChampions,
    getTrustScoreColor,
  } = useEnhancedConnections();

  const { 
    pendingRequests, 
    acceptedConnections, 
    loading: connectionRequestsLoading 
  } = useConnectionRequests();

  if (connectionRequestsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your network...</p>
        </div>
      </div>
    );
  }

  // Transform acceptedConnections to match the expected format
  const transformedConnections = acceptedConnections.map(conn => ({
    id: conn.id,
    partner_id: conn.requester_id === conn.addressee_id ? conn.requester_id : 
                (conn.requester && conn.requester.id !== conn.addressee?.id ? conn.addressee_id : conn.requester_id),
    partner_profile: conn.requester && conn.requester.id !== conn.addressee?.id ? conn.addressee : conn.requester
  }));

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
        connectedPeople={transformedConnections}
        suggestedConnections={[]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ConnectionsTabsList activeTab={activeTab} />

        <TabsContent value="overview" className="space-y-6">
          <ConnectionStats
            totalConnections={acceptedConnections.length}
            pendingRequests={pendingRequests.length}
            groupsJoined={0}
            campaignsActive={0}
            weeklyGrowth={12}
          />

          <DatabaseConnectionInsights
            connectedPeople={transformedConnections}
            suggestedConnections={[]}
          />

          {pendingRequests.length > 0 && (
            <PendingRequests getTrustScoreColor={getTrustScoreColor} />
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
            <PendingRequests getTrustScoreColor={getTrustScoreColor} />
          )}

          <ConnectedPeople getTrustScoreColor={getTrustScoreColor} />

          <SuggestedConnections getTrustScoreColor={getTrustScoreColor} />
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
          <SuggestedConnections getTrustScoreColor={getTrustScoreColor} />
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
