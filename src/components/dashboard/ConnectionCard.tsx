
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, MessageSquare, X, Check, Star, MapPin } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";

interface ConnectionCardProps {
  connection: ConnectionRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onSendRequest?: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
  variant?: "pending" | "connected" | "suggested";
}

const ConnectionCard = ({ 
  connection, 
  onAccept, 
  onDecline, 
  onSendRequest, 
  getTrustScoreColor,
  variant = "suggested"
}: ConnectionCardProps) => {
  const getStatusButtons = () => {
    switch (connection.status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button onClick={() => onAccept?.(connection.id)} size="sm" className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button onClick={() => onDecline?.(connection.id)} variant="outline" size="sm">
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
          <Button onClick={() => onSendRequest?.(connection.id)} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        );
      default:
        return (
          <Button onClick={() => onSendRequest?.(connection.id)} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        );
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "pending": return "border-orange-200";
      case "connected": return "border-green-200";
      default: return "";
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getBorderColor()}`}>
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
              {connection.location} • {variant === "suggested" ? `Joined ${connection.joinedDate}` : connection.lastActive}
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
              {variant === "connected" && (
                <Badge variant="outline" className="text-xs">
                  {connection.helpedPeople} helped
                </Badge>
              )}
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
          {getStatusButtons()}
          {connection.status === "connected" && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Connected
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
