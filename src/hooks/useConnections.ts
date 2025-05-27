
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectionRequest, Group, Campaign, PeopleYouMayKnow } from "@/types/connections";
import { mockConnections, mockGroups, mockCampaigns, mockPeopleYouMayKnow } from "@/data/mockConnections";

export const useConnections = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<ConnectionRequest[]>(mockConnections);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<PeopleYouMayKnow[]>(mockPeopleYouMayKnow);

  const handleAcceptConnection = (id: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, status: "connected" } : conn
      )
    );
    toast({
      title: "Connection accepted!",
      description: "You're now connected and can start helping each other.",
    });
  };

  const handleDeclineConnection = (id: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, status: "declined" } : conn
      )
    );
    toast({
      title: "Connection declined",
      description: "The connection request has been declined.",
    });
  };

  const handleSendRequest = (id: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, status: "sent" } : conn
      )
    );
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent. You'll be notified when they respond.",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, isJoined: true, memberCount: group.memberCount + 1 } : group
      )
    );
    toast({
      title: "Joined group!",
      description: "You've successfully joined the group and can now participate.",
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, isJoined: false, memberCount: group.memberCount - 1 } : group
      )
    );
    toast({
      title: "Left group",
      description: "You've left the group.",
    });
  };

  const handleJoinCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === campaignId ? { ...campaign, isParticipating: true, participantCount: campaign.participantCount + 1 } : campaign
      )
    );
    toast({
      title: "Joined campaign!",
      description: "You're now participating in this campaign.",
    });
  };

  const handleLeaveCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === campaignId ? { ...campaign, isParticipating: false, participantCount: campaign.participantCount - 1 } : campaign
      )
    );
    toast({
      title: "Left campaign",
      description: "You're no longer participating in this campaign.",
    });
  };

  const handleSendPersonRequest = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent.",
    });
  };

  const handleDismissPerson = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Suggestion removed",
      description: "This person won't be suggested again.",
    });
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const pendingRequests = connections.filter(c => c.status === "pending");
  const connectedPeople = connections.filter(c => c.status === "connected");
  const suggestedConnections = connections.filter(c => c.status !== "pending" && c.status !== "connected");
  
  const myGroups = groups.filter(g => g.isJoined);
  const suggestedGroups = groups.filter(g => !g.isJoined);

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
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
    handleJoinGroup,
    handleLeaveGroup,
    handleJoinCampaign,
    handleLeaveCampaign,
    handleSendPersonRequest,
    handleDismissPerson,
    getTrustScoreColor,
  };
};
