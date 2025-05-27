
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, MessageSquare, X, Check, Star, MapPin, MoreHorizontal, UserCheck, Clock, Heart } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleViewProfile = () => {
    toast({
      title: "Profile Preview",
      description: `Viewing ${connection.name}'s profile...`,
    });
  };

  const handleRecommend = () => {
    toast({
      title: "Recommend Connection",
      description: `Recommending ${connection.name} to your network...`,
    });
  };

  const handleBlock = () => {
    toast({
      title: "Connection Blocked",
      description: `${connection.name} has been blocked and won't appear in suggestions.`,
    });
  };

  const getConnectionStrength = () => {
    if (connection.mutualConnections >= 10) return { label: "Strong", color: "text-green-600", icon: "●●●" };
    if (connection.mutualConnections >= 5) return { label: "Medium", color: "text-yellow-600", icon: "●●○" };
    return { label: "New", color: "text-gray-600", icon: "●○○" };
  };

  const getLastActivity = () => {
    if (variant === "connected") return connection.lastActive;
    return `Active ${connection.lastActive}`;
  };

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
          <Button variant="outline" size="sm" disabled className="bg-gray-50">
            <Clock className="h-4 w-4 mr-2" />
            Request Sent
          </Button>
        );
      case "connected":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Recommend
            </Button>
          </div>
        );
      case "declined":
        return (
          <Button onClick={() => onSendRequest?.(connection.id)} size="sm" variant="outline">
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
      case "pending": return "border-orange-200 bg-orange-50/30";
      case "connected": return "border-green-200 bg-green-50/30";
      default: return "border-gray-200";
    }
  };

  const connectionStrength = getConnectionStrength();

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${getBorderColor()} group`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-white shadow-sm">
                <AvatarImage src={connection.avatar} />
                <AvatarFallback className="text-lg">
                  {connection.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {variant === "connected" && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <UserCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewProfile}>
                    {connection.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {connection.location} • {getLastActivity()}
                  </CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleViewProfile}>
                      View Profile
                    </DropdownMenuItem>
                    {variant === "connected" && (
                      <DropdownMenuItem onClick={handleRecommend}>
                        Recommend to Others
                      </DropdownMenuItem>
                    )}
                    {variant !== "connected" && (
                      <DropdownMenuItem onClick={handleBlock} className="text-red-600">
                        Block User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
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
                <Badge variant="secondary" className={`text-xs ${connectionStrength.color}`}>
                  <span className="mr-1">{connectionStrength.icon}</span>
                  {connectionStrength.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{connection.bio}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {connection.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs hover:bg-blue-100 cursor-pointer transition-colors">
              {skill}
            </Badge>
          ))}
          {connection.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{connection.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {getStatusButtons()}
          {connection.status === "connected" && (
            <span className="text-sm text-green-600 font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-1" />
              Connected
            </span>
          )}
          {variant === "suggested" && connection.mutualConnections > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">{connection.mutualConnections}</span> mutual connections
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
