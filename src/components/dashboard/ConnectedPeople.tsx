
import { Users } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";
import ConnectionCard from "./ConnectionCard";

interface ConnectedPeopleProps {
  connectedPeople: ConnectionRequest[];
  getTrustScoreColor: (score: number) => string;
}

const ConnectedPeople = ({ connectedPeople, getTrustScoreColor }: ConnectedPeopleProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center">
        <Users className="h-5 w-5 mr-2 text-teal-600" />
        Your Connections ({connectedPeople.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {connectedPeople.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            getTrustScoreColor={getTrustScoreColor}
            variant="connected"
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectedPeople;
