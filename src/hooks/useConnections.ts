
import { useConnectionsManager } from "./useConnectionsManager";
import { useGroupsManager } from "./useGroupsManager";
import { useCampaignsManager } from "./useCampaignsManager";
import { usePeopleYouMayKnow } from "./usePeopleYouMayKnow";
import { useChampions } from "./useChampions";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

export const useConnections = () => {
  const {
    connections,
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
  } = useConnectionsManager();

  const {
    groups,
    myGroups,
    suggestedGroups,
    handleJoinGroup,
    handleLeaveGroup,
  } = useGroupsManager();

  const {
    campaigns,
    handleJoinCampaign,
    handleLeaveCampaign,
  } = useCampaignsManager();

  const {
    peopleYouMayKnow,
    handleSendPersonRequest,
    handleDismissPerson,
  } = usePeopleYouMayKnow();

  const {
    champions,
    followedChampions,
    handleFollowChampion,
  } = useChampions();

  return {
    connections,
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    groups,
    myGroups,
    suggestedGroups,
    campaigns,
    peopleYouMayKnow,
    champions,
    followedChampions,
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
  };
};
