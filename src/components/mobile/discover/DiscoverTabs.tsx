
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedConnectionRequests from "./EnhancedConnectionRequests";
import LocationBasedDiscovery from "./LocationBasedDiscovery";
import SkillBasedMatching from "./SkillBasedMatching";
import InterestBasedRecommendations from "./InterestBasedRecommendations";
import RealTimeActivityFeed from "./RealTimeActivityFeed";
import ConnectionInsights from "./ConnectionInsights";
import SmartNetworkingFeatures from "./SmartNetworkingFeatures";
import RecommendationsSection from "./RecommendationsSection";
import TrendingSection from "./TrendingSection";
import CampaignsSection from "./CampaignsSection";
import ConnectionsSection from "./ConnectionsSection";
import GroupsSection from "./GroupsSection";

interface DiscoverTabsProps {
  activeFilter: string;
  onConnect: (personId: string) => void;
  onJoinGroup: (groupId: string) => void;
  onJoinCampaign: (campaignId: string) => void;
  onAcceptConnection: (id: string, message?: string) => void;
  onDeclineConnection: (id: string) => void;
  onSendCustomRequest: (id: string, message: string) => void;
  onInterestAction: (id: string, type: string) => void;
  onViewProfile: (userId: string) => void;
  onViewDetails: (type: string) => void;
  onStartConversation: (personId: string, message: string) => void;
  onJoinEvent: (eventId: string) => void;
  onSetGoal: (goal: string) => void;
}

const DiscoverTabs = ({ 
  activeFilter,
  onConnect,
  onJoinGroup,
  onJoinCampaign,
  onAcceptConnection,
  onDeclineConnection,
  onSendCustomRequest,
  onInterestAction,
  onViewProfile,
  onViewDetails,
  onStartConversation,
  onJoinEvent,
  onSetGoal
}: DiscoverTabsProps) => {
  return (
    <Tabs defaultValue="discover" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="discover">Discover</TabsTrigger>
        <TabsTrigger value="connect">Connect</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="discover" className="space-y-4">
        <EnhancedConnectionRequests
          onAccept={onAcceptConnection}
          onDecline={onDeclineConnection}
          onSendCustomRequest={onSendCustomRequest}
        />

        {(activeFilter === "all" || activeFilter === "nearby") && (
          <LocationBasedDiscovery onConnect={onConnect} />
        )}

        {(activeFilter === "all" || activeFilter === "skills") && (
          <SkillBasedMatching onConnect={onConnect} />
        )}

        <InterestBasedRecommendations onAction={onInterestAction} />

        <RecommendationsSection />

        <TrendingSection activeFilter={activeFilter} />

        <CampaignsSection 
          activeFilter={activeFilter} 
          onJoinCampaign={onJoinCampaign} 
        />
      </TabsContent>

      <TabsContent value="connect" className="space-y-4">
        <RealTimeActivityFeed onViewProfile={onViewProfile} />

        <ConnectionsSection onConnect={onConnect} />

        <SmartNetworkingFeatures
          onStartConversation={onStartConversation}
          onJoinEvent={onJoinEvent}
          onSetGoal={onSetGoal}
        />

        <GroupsSection onJoinGroup={onJoinGroup} />
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ConnectionInsights onViewDetails={onViewDetails} />
      </TabsContent>
    </Tabs>
  );
};

export default DiscoverTabs;
