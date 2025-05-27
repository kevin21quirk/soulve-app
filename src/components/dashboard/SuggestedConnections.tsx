
import { ConnectionRequest } from "@/types/connections";
import ConnectionCard from "./ConnectionCard";

interface SuggestedConnectionsProps {
  suggestedConnections: ConnectionRequest[];
  onSendRequest: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
}

const SuggestedConnections = ({ 
  suggestedConnections, 
  onSendRequest, 
  getTrustScoreColor 
}: SuggestedConnectionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Suggested Connections</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {suggestedConnections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onSendRequest={onSendRequest}
            getTrustScoreColor={getTrustScoreColor}
            variant="suggested"
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;
