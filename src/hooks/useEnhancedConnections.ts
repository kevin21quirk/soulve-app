
import { useState } from "react";
import { useRealConnections, useSuggestedConnections, useSendConnectionRequest, useRespondToConnection } from "@/services/realConnectionsService";
import { useAuth } from "@/contexts/AuthContext";
import { useConnectionsRealtime } from "./useConnectionsRealtime";

export const useEnhancedConnections = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSearch, setShowSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Enable real-time updates
  useConnectionsRealtime();
  
  // Real database connections
  const { data: connections = [], isLoading: connectionsLoading } = useRealConnections();
  const { data: suggestedProfiles = [], isLoading: suggestionsLoading } = useSuggestedConnections();
  const sendConnectionRequest = useSendConnectionRequest();
  const respondToConnection = useRespondToConnection();

  // Process connections data
  // Only show requests where current user is the addressee (recipient)
  const pendingRequests = connections.filter(conn => 
    conn.status === 'pending' && conn.addressee_id === user?.id
  );
  
  // For accepted connections, show the other person's profile
  const connectedPeople = connections
    .filter(conn => conn.status === 'accepted')
    .map(conn => ({
      id: conn.id,
      partner_id: conn.requester_id === user?.id ? conn.addressee_id : conn.requester_id,
      partner_profile: conn.requester_id === user?.id ? conn.addressee : conn.requester
    }));

  // Transform suggested profiles to match SuggestedConnection interface
  const suggestedConnections = suggestedProfiles.map(profile => ({
    id: `suggestion-${profile.id}`,
    target_user_id: profile.id,
    target_profile: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
      location: profile.location,
    },
    recommendation_type: 'similar_interests',
    confidence_score: 85,
    reasoning: 'Based on shared interests and location',
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

  const isLoading = connectionsLoading || suggestionsLoading;

  return {
    // State
    activeTab,
    setActiveTab,
    showSearch,
    setShowSearch,
    showAnalytics,
    setShowAnalytics,
    
    // Data
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    mockGroups,
    mockCampaigns,
    mockPeople,
    mockChampions,
    
    // Handlers
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
    getTrustScoreColor,
    
    // Loading state
    isLoading,
  };
};
