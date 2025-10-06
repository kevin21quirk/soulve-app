
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, UserPlus, Users, Check, X } from "lucide-react";
import { useRealConnections, useSendConnectionRequest, useRespondToConnection, useSuggestedConnections } from "@/services/realConnectionsService";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectionsRealtime } from "@/hooks/useConnectionsRealtime";

export const RealConnections = () => {
  const navigate = useNavigate();
  
  // Enable real-time updates
  useConnectionsRealtime();
  
  const { data: connections, isLoading: connectionsLoading } = useRealConnections();
  const { data: suggested, isLoading: suggestedLoading } = useSuggestedConnections();
  const sendRequest = useSendConnectionRequest();
  const respondToConnection = useRespondToConnection();

  if (connectionsLoading || suggestedLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Filter connections by type
  const pendingRequests = connections?.filter(conn => 
    conn.status === 'pending' && conn.addressee?.id // Requests I received
  ) || [];
  
  const acceptedConnections = connections?.filter(conn => 
    conn.status === 'accepted'
  ) || [];

  const sentRequests = connections?.filter(conn => 
    conn.status === 'pending' && conn.requester?.id // Requests I sent
  ) || [];

  const getProfileName = (profile: any) => {
    if (!profile) return 'Unknown User';
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
  };

  const getInitials = (profile: any) => {
    if (!profile) return 'UN';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AN';
  };

  return (
    <div className="space-y-6">
      {/* Pending Connection Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((connection) => {
              const profile = connection.requester;
              return (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{getProfileName(profile)}</h4>
                      <p className="text-sm text-muted-foreground">{profile?.location || 'Location not specified'}</p>
                      {profile?.bio && (
                        <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToConnection.mutate({ connectionId: connection.id, status: 'accepted' })}
                      disabled={respondToConnection.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => respondToConnection.mutate({ connectionId: connection.id, status: 'declined' })}
                      disabled={respondToConnection.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Connected People */}
      {acceptedConnections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Connections ({acceptedConnections.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {acceptedConnections.map((connection) => {
              // Show the other person's profile
              const profile = connection.requester?.id === connection.addressee?.id ? connection.addressee : connection.requester;
              return (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{getProfileName(profile)}</h4>
                      <p className="text-sm text-muted-foreground">{profile?.location || 'Location not specified'}</p>
                      {profile?.skills && profile.skills.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {profile.skills.slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Suggested Connections */}
      {suggested && suggested.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              People You May Know
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggested.slice(0, 5).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                >
                  <Avatar>
                    <AvatarImage src={profile.avatar_url || ''} />
                    <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{getProfileName(profile)}</h4>
                    <p className="text-sm text-muted-foreground">{profile.location || 'Location not specified'}</p>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
                    )}
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {profile.interests.slice(0, 3).map((interest: string) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => sendRequest.mutate(profile.id)}
                  disabled={sendRequest.isPending}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Sent Requests ({sentRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sentRequests.map((connection) => {
              const profile = connection.addressee;
              return (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{getProfileName(profile)}</h4>
                      <p className="text-sm text-muted-foreground">{profile?.location || 'Location not specified'}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
