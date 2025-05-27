
import { UserPlus } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";
import ConnectionCard from "./ConnectionCard";

interface PendingRequestsProps {
  pendingRequests: ConnectionRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
}

const PendingRequests = ({ 
  pendingRequests, 
  onAccept, 
  onDecline, 
  getTrustScoreColor 
}: PendingRequestsProps) => {
  if (pendingRequests.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <UserPlus className="h-5 w-5 mr-2" />
        Pending Requests ({pendingRequests.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pendingRequests.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onAccept={onAccept}
            onDecline={onDecline}
            getTrustScoreColor={getTrustScoreColor}
            variant="pending"
          />
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
