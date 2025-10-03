
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Users } from "lucide-react";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import TrustScoreDisplay from "./TrustScoreDisplay";
import { useNavigate } from "react-router-dom";

interface ConnectedPeopleProps {
  getTrustScoreColor: (score: number) => string;
}

const ConnectedPeople = ({ getTrustScoreColor }: ConnectedPeopleProps) => {
  const { acceptedConnections, loading } = useConnectionRequests();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading connections...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (acceptedConnections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No connections yet. Start connecting with people in your community!</p>
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
          <Badge variant="outline">{acceptedConnections.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {acceptedConnections.map((connection) => {
            // Show the other person's profile (not the current user)
            const isRequester = connection.requester && connection.requester.id !== connection.addressee?.id;
            const profile = isRequester ? connection.addressee : connection.requester;
            const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous';
            
            return (
              <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/profile/${profile?.id}`)}
                  >
                    <AvatarImage src={profile?.avatar_url} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 
                      className="font-semibold text-gray-900 cursor-pointer hover:underline"
                      onClick={() => navigate(`/profile/${profile?.id}`)}
                    >
                      {name}
                    </h3>
                    {profile?.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <TrustScoreDisplay score={85} size="sm" showBadge={false} />
                      {connection.mutual_connections_count !== undefined && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {connection.mutual_connections_count} mutual
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af] hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedPeople;
