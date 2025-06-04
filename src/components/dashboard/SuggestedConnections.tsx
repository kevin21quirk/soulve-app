
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import TrustScoreDisplay from "./TrustScoreDisplay";

interface SuggestedConnection {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  mutual_connections_count?: number;
}

interface SuggestedConnectionsProps {
  getTrustScoreColor: (score: number) => string;
}

const SuggestedConnections = ({ getTrustScoreColor }: SuggestedConnectionsProps) => {
  const { user } = useAuth();
  const { sendConnectionRequest, mutualConnectionsCount } = useConnectionRequests();
  const [suggestedConnections, setSuggestedConnections] = useState<SuggestedConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedConnections = async () => {
      if (!user) return;

      try {
        // Get all user IDs that the current user is already connected to or has pending requests with
        const { data: existingConnections } = await supabase
          .from('connections')
          .select('requester_id, addressee_id')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

        const connectedUserIds = new Set([
          user.id, // Exclude self
          ...(existingConnections || []).flatMap(conn => [conn.requester_id, conn.addressee_id])
        ]);

        // Get profiles not in the connected users list
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, location, bio')
          .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
          .limit(10);

        if (error) throw error;

        // Calculate mutual connections for each suggestion
        const suggestionsWithMutual = await Promise.all(
          (profiles || []).map(async (profile) => {
            const mutualCount = await mutualConnectionsCount(user.id, profile.id);
            return { ...profile, mutual_connections_count: mutualCount };
          })
        );

        setSuggestedConnections(suggestionsWithMutual);
      } catch (error) {
        console.error('Error fetching suggested connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedConnections();
  }, [user, mutualConnectionsCount]);

  const handleSendRequest = async (userId: string) => {
    const success = await sendConnectionRequest(userId);
    if (success) {
      // Remove from suggestions
      setSuggestedConnections(prev => prev.filter(conn => conn.id !== userId));
    }
  };

  const handleDismiss = (connectionId: string) => {
    setSuggestedConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading suggestions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            const name = `${suggestion.first_name || ''} ${suggestion.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={suggestion.avatar_url} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    {suggestion.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {suggestion.location}
                      </div>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <TrustScoreDisplay score={78} size="sm" showBadge={false} />
                      {suggestion.mutual_connections_count !== undefined && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {suggestion.mutual_connections_count} mutual
                        </div>
                      )}
                    </div>
                    {suggestion.bio && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{suggestion.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendRequest(suggestion.id)}
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
