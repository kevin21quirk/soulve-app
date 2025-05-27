
import { useConnections } from "@/hooks/useConnections";
import PendingRequests from "./PendingRequests";
import ConnectedPeople from "./ConnectedPeople";
import SuggestedConnections from "./SuggestedConnections";

const EnhancedConnections = () => {
  const {
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
    getTrustScoreColor,
  } = useConnections();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Network</h2>
        <p className="text-gray-600">Build trust and connections within your community</p>
      </div>

      <PendingRequests
        pendingRequests={pendingRequests}
        onAccept={handleAcceptConnection}
        onDecline={handleDeclineConnection}
        getTrustScoreColor={getTrustScoreColor}
      />

      <ConnectedPeople
        connectedPeople={connectedPeople}
        getTrustScoreColor={getTrustScoreColor}
      />

      <SuggestedConnections
        suggestedConnections={suggestedConnections}
        onSendRequest={handleSendRequest}
        getTrustScoreColor={getTrustScoreColor}
      />
    </div>
  );
};

export default EnhancedConnections;
