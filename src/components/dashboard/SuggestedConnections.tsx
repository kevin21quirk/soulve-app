
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, MapPin, Users } from "lucide-react";
import TrustScoreDisplay from "./TrustScoreDisplay";

interface SuggestedConnection {
  id: string;
  target_user_id: string;
  target_profile: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    location?: string;
  };
  recommendation_type: string;
  confidence_score: number;
  reasoning?: string;
}

interface SuggestedConnectionsProps {
  suggestedConnections: SuggestedConnection[];
  onSendRequest: (userId: string) => void;
  getTrustScoreColor: (score: number) => string;
}

const SuggestedConnections = ({ suggestedConnections, onSendRequest, getTrustScoreColor }: SuggestedConnectionsProps) => {
  const handleDismiss = (connectionId: string) => {
    console.log("Dismiss suggestion:", connectionId);
  };

  if (suggestedConnections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No suggestions available at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Suggested Connections</span>
          <Badge variant="outline">{suggestedConnections.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedConnections.map((suggestion) => {
            const profile = suggestion.target_profile || {};
            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    {profile.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <TrustScoreDisplay score={78} size="sm" showBadge={false} />
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        3 mutual connections
                      </div>
                    </div>
                    {suggestion.reasoning && (
                      <p className="text-xs text-gray-600 mt-1">{suggestion.reasoning}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSendRequest(suggestion.target_user_id)}
                    className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af] hover:text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(suggestion.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
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

export default SuggestedConnections;
