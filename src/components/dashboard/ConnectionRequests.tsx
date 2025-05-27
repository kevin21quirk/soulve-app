
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectionRequest {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  mutualConnections: number;
  helpedPeople: number;
  location: string;
  bio: string;
  status: "pending" | "sent" | "connected";
}

const ConnectionRequests = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<ConnectionRequest[]>([
    {
      id: "1",
      name: "Emily Rodriguez",
      avatar: "",
      trustScore: 94,
      mutualConnections: 8,
      helpedPeople: 23,
      location: "Downtown",
      bio: "Community volunteer passionate about helping families in need. Specializes in childcare and meal preparation.",
      status: "pending"
    },
    {
      id: "2",
      name: "James Wilson",
      avatar: "",
      trustScore: 87,
      mutualConnections: 5,
      helpedPeople: 15,
      location: "Riverside",
      bio: "Handyman and carpenter offering home repair services. Available weekends for community projects.",
      status: "sent"
    },
    {
      id: "3",
      name: "Maria Santos",
      avatar: "",
      trustScore: 96,
      mutualConnections: 12,
      helpedPeople: 31,
      location: "Uptown",
      bio: "Licensed nurse providing health advice and emotional support. Active in senior care initiatives.",
      status: "connected"
    }
  ]);

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
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusButton = (connection: ConnectionRequest) => {
    switch (connection.status) {
      case "pending":
        return (
          <Button onClick={() => handleAcceptConnection(connection.id)} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Accept
          </Button>
        );
      case "sent":
        return (
          <Button variant="outline" size="sm" disabled>
            Request Sent
          </Button>
        );
      case "connected":
        return (
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        );
      default:
        return (
          <Button onClick={() => handleSendRequest(connection.id)} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Network</h2>
        <p className="text-gray-600">Build trust and connections within your community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connections.map((connection) => (
          <Card key={connection.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={connection.avatar} />
                  <AvatarFallback className="text-lg">
                    {connection.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl">{connection.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-2">
                    {connection.location}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTrustScoreColor(connection.trustScore)}>
                      Trust Score: {connection.trustScore}%
                    </Badge>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {connection.mutualConnections} mutual
                    </Badge>
                    <Badge variant="outline">
                      {connection.helpedPeople} helped
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4">{connection.bio}</p>
              <div className="flex justify-between items-center">
                {getStatusButton(connection)}
                {connection.status === "connected" && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Connected
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConnectionRequests;
