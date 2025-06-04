
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Clock, Users } from "lucide-react";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import TrustScoreDisplay from "./TrustScoreDisplay";

interface PendingRequestsProps {
  getTrustScoreColor: (score: number) => string;
}

const PendingRequests = ({ getTrustScoreColor }: PendingRequestsProps) => {
  const { pendingRequests, respondToConnectionRequest, loading } = useConnectionRequests();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleAcceptConnection = async (connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'accepted');
  };

  const handleDeclineConnection = async (connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'declined');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connection Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Connection Requests</span>
          <Badge variant="secondary">{pendingRequests.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request) => {
            const profile = request.requester || {};
            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
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
                    <div className="flex items-center space-x-3 mt-2">
                      <TrustScoreDisplay score={82} size="sm" showBadge={false} />
                      {request.mutual_connections_count !== undefined && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {request.mutual_connections_count} mutual
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(request.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptConnection(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeclineConnection(request.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
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

export default PendingRequests;
