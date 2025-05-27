
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectionRequest } from "@/types/connections";
import { mockConnections } from "@/data/mockConnections";

export const useConnections = () => {
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

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
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
    getTrustScoreColor,
  };
};
