
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Clock, Users } from "lucide-react";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import TrustScoreDisplay from "./TrustScoreDisplay";
import { useNavigate } from "react-router-dom";

interface PendingRequestsProps {
  getTrustScoreColor: (score: number) => string;
}

const PendingRequests = ({ getTrustScoreColor }: PendingRequestsProps) => {
  const { pendingRequests, respondToConnectionRequest, loading } = useConnectionRequests();
  const navigate = useNavigate();

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
            const profile = request.requester || { first_name: '', last_name: '', avatar_url: '', location: '' };
            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 p-4 border rounded-lg bg-blue-50/50">
                <div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto">
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                    onClick={() => navigate(`/profile/${request.requester_id}`)}
                  >
                    <AvatarImage src={profile.avatar_url || ''} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 
                      className="font-semibold text-gray-900 cursor-pointer hover:underline truncate"
                      onClick={() => navigate(`/profile/${request.requester_id}`)}
                    >
                      {name}
                    </h3>
                    {profile.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                      <TrustScoreDisplay score={82} size="sm" showBadge={false} />
                      {request.mutual_connections_count !== undefined && (
                        <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                          <Users className="h-3 w-3 mr-1" />
                          {request.mutual_connections_count} mutual
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(request.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptConnection(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeclineConnection(request.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
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
