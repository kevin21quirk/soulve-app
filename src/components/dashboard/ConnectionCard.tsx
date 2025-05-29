
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionRequest } from "@/types/connections";
import { MapPin, Users, Clock, UserPlus, UserCheck, UserX } from "lucide-react";

interface ConnectionCardProps {
  connection: ConnectionRequest;
  onSendRequest?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
  variant: "suggested" | "pending" | "connected";
}

const ConnectionCard = ({ 
  connection, 
  onSendRequest, 
  onAccept, 
  onDecline, 
  getTrustScoreColor, 
  variant 
}: ConnectionCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback>
                {connection.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{connection.name}</h4>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{connection.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trust Score</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrustScoreColor(connection.trustScore)}`}>
                {connection.trustScore}%
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{connection.mutualConnections} mutual</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Active {connection.lastActive}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{connection.bio}</p>

          <div className="flex flex-wrap gap-1">
            {connection.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            {variant === "suggested" && onSendRequest && (
              <Button 
                onClick={() => onSendRequest(connection.id)}
                variant="gradient"
                className="flex-1"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Send Request
              </Button>
            )}
            
            {variant === "pending" && onAccept && onDecline && (
              <>
                <Button 
                  onClick={() => onAccept(connection.id)}
                  variant="gradient"
                  className="flex-1"
                  size="sm"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  onClick={() => onDecline(connection.id)}
                  variant="outline" 
                  size="sm"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}
            
            {variant === "connected" && (
              <Button variant="outline" className="flex-1" size="sm" disabled>
                <UserCheck className="h-4 w-4 mr-1" />
                Connected
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
