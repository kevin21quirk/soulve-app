
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, MessageSquare, X, Check, Star, MapPin } from "lucide-react";
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
  status: "pending" | "sent" | "connected" | "declined";
  skills: string[];
  joinedDate: string;
  lastActive: string;
}

const EnhancedConnections = () => {
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
      status: "pending",
      skills: ["Childcare", "Cooking", "Event Planning"],
      joinedDate: "6 months ago",
      lastActive: "2 hours ago"
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
      status: "sent",
      skills: ["Home Repair", "Carpentry", "Electrical"],
      joinedDate: "1 year ago",
      lastActive: "1 day ago"
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
      status: "connected",
      skills: ["Healthcare", "Senior Care", "Counseling"],
      joinedDate: "2 years ago",
      lastActive: "Online now"
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "",
      trustScore: 89,
      mutualConnections: 3,
      helpedPeople: 12,
      location: "Westside",
      bio: "Software developer offering tech support and digital literacy training for seniors.",
      status: "pending",
      skills: ["Tech Support", "Teaching", "Web Development"],
      joinedDate: "8 months ago",
      lastActive: "30 minutes ago"
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

  const getStatusButtons = (connection: ConnectionRequest) => {
    switch (connection.status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleAcceptConnection(connection.id)} size="sm" className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button onClick={() => handleDeclineConnection(connection.id)} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
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
      case "declined":
        return (
          <Button onClick={() => handleSendRequest(connection.id)} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Reconnect
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

  const pendingRequests = connections.filter(c => c.status === "pending");
  const connectedPeople = connections.filter(c => c.status === "connected");
  const suggestedConnections = connections.filter(c => c.status !== "pending" && c.status !== "connected");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Network</h2>
        <p className="text-gray-600">Build trust and connections within your community</p>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingRequests.map((connection) => (
              <Card key={connection.id} className="hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback className="text-lg">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{connection.name}</CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {connection.location} • {connection.lastActive}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className={`text-xs ${getTrustScoreColor(connection.trustScore)}`}>
                          <Star className="h-3 w-3 mr-1" />
                          {connection.trustScore}% Trust
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {connection.mutualConnections} mutual
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 text-sm mb-3">{connection.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {connection.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {getStatusButtons(connection)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Connected People */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Your Connections ({connectedPeople.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {connectedPeople.map((connection) => (
            <Card key={connection.id} className="hover:shadow-lg transition-shadow border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={connection.avatar} />
                    <AvatarFallback className="text-lg">
                      {connection.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {connection.location} • {connection.lastActive}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge className={`text-xs ${getTrustScoreColor(connection.trustScore)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        {connection.trustScore}% Trust
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {connection.helpedPeople} helped
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm mb-3">{connection.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {connection.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  {getStatusButtons(connection)}
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Connected
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Suggested Connections</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestedConnections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={connection.avatar} />
                    <AvatarFallback className="text-lg">
                      {connection.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {connection.location} • Joined {connection.joinedDate}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge className={`text-xs ${getTrustScoreColor(connection.trustScore)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        {connection.trustScore}% Trust
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {connection.mutualConnections} mutual
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm mb-3">{connection.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {connection.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {getStatusButtons(connection)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedConnections;
