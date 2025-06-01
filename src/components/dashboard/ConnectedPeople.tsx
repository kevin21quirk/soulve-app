
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, UserX, MapPin, Calendar } from "lucide-react";
import TrustScoreDisplay from "./TrustScoreDisplay";

interface ConnectedPerson {
  id: string;
  partner_id: string;
  partner_profile: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    location?: string;
  };
}

interface ConnectedPeopleProps {
  connectedPeople: ConnectedPerson[];
  getTrustScoreColor: (score: number) => string;
}

const ConnectedPeople = ({ connectedPeople, getTrustScoreColor }: ConnectedPeopleProps) => {
  const handleMessage = (personId: string) => {
    console.log("Message person:", personId);
  };

  const handleDisconnect = (personId: string) => {
    console.log("Disconnect from person:", personId);
  };

  if (connectedPeople.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Your Connections</span>
            <Badge variant="outline">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No connections yet. Start building your network!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Your Connections</span>
          <Badge variant="outline">{connectedPeople.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectedPeople.map((connection) => {
            const profile = connection.partner_profile || {};
            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    {profile.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <TrustScoreDisplay score={75} size="sm" showBadge={false} />
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Connected 2 days ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessage(connection.partner_id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(connection.partner_id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedPeople;
