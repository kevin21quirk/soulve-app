
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, MessageCircle, MapPin } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface ConnectionsSectionProps {
  onConnect: (personId: string) => void;
}

const ConnectionsSection = ({ onConnect }: ConnectionsSectionProps) => {
  const { suggestedConnections, peopleYouMayKnow } = useConnections();

  return (
    <>
      {/* People You May Know */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-blue-500" />
            <span>People You May Know</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {peopleYouMayKnow.slice(0, 3).map((person) => (
            <div key={person.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{person.name}</h4>
                <p className="text-xs text-gray-600">{person.reason}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {person.location}
                </p>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="gradient" 
                  size="sm"
                  onClick={() => onConnect(person.id)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <UserPlus className="h-5 w-5 text-purple-500" />
            <span>Suggested Connections</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedConnections.slice(0, 3).map((connection) => (
            <div key={connection.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{connection.name}</h4>
                <p className="text-xs text-gray-600">{connection.bio}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {connection.trustScore}% trust
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {connection.helpedPeople} helped
                  </Badge>
                </div>
              </div>
              <Button 
                variant="gradient" 
                size="sm"
                onClick={() => onConnect(connection.id)}
              >
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default ConnectionsSection;
