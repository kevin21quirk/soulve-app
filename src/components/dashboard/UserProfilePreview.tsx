
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Calendar, MessageSquare, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfilePreviewProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    trustScore: number;
    helpCount: number;
    joinDate: string;
    bio: string;
    badges: string[];
    mutualConnections: number;
  };
  onClose: () => void;
}

const UserProfilePreview = ({ user, onClose }: UserProfilePreviewProps) => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Connection request sent!",
      description: `Your request to connect with ${user.name} has been sent.`,
    });
    onClose();
  };

  const handleMessage = () => {
    toast({
      title: "Message started!",
      description: `Opening conversation with ${user.name}.`,
    });
    onClose();
  };

  return (
    <Card className="w-80 shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
        <div className="flex items-center justify-center space-x-1 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{user.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{user.trustScore}</span>
            </div>
            <p className="text-xs text-gray-500">Trust Score</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{user.helpCount}</span>
            </div>
            <p className="text-xs text-gray-500">Helped</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="font-semibold">{user.joinDate}</span>
            </div>
            <p className="text-xs text-gray-500">Joined</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-700 mb-2">{user.bio}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {user.badges.map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>

        {user.mutualConnections > 0 && (
          <p className="text-xs text-blue-600">
            {user.mutualConnections} mutual connections
          </p>
        )}

        <div className="flex space-x-2 pt-2">
          <Button onClick={handleConnect} className="flex-1" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button onClick={handleMessage} variant="outline" className="flex-1" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>

        <Button onClick={onClose} variant="ghost" className="w-full" size="sm">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfilePreview;
