
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectionRequest } from "@/types/connections";
import { mockConnections } from "@/data/mockConnections";

export const useConnectionsManager = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<ConnectionRequest[]>(mockConnections);

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

  const pendingRequests = connections.filter(c => c.status === "pending");
  const connectedPeople = connections.filter(c => c.status === "connected");
  const suggestedConnections = connections.filter(c => c.status !== "pending" && c.status !== "connected");

  return {
    connections,
    pendingRequests,
    connectedPeople,
    suggestedConnections,
    handleAcceptConnection,
    handleDeclineConnection,
    handleSendRequest,
  };
};
