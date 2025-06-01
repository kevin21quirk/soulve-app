
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, UserPlus, MessageSquare, Star } from "lucide-react";
import { useSuggestedConnections, useSendConnectionRequest } from "@/services/realConnectionsService";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoverPeopleProps {
  searchQuery: string;
}

const DiscoverPeople = ({ searchQuery }: DiscoverPeopleProps) => {
  const { data: suggestedPeople, isLoading } = useSuggestedConnections();
  const sendConnectionRequest = useSendConnectionRequest();

  const filteredPeople = suggestedPeople?.filter(person => {
    if (!searchQuery) return true;
    const fullName = `${person.first_name || ''} ${person.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           person.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           person.location?.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            <span>Discover People</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-blue-500" />
          <span>Discover People ({filteredPeople.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No people found matching your search.</p>
          </div>
        ) : (
          filteredPeople.map((person) => {
            const displayName = `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Anonymous';
            
            return (
              <div key={person.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={person.avatar_url || ''} alt={displayName} />
                  <AvatarFallback>
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">{displayName}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-500">New</span>
                    </div>
                  </div>
                  
                  {person.location && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {person.location}
                    </p>
                  )}
                  
                  {person.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {person.bio}
                    </p>
                  )}
                  
                  {person.interests && person.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {person.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {person.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{person.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => sendConnectionRequest.mutate(person.id)}
                    disabled={sendConnectionRequest.isPending}
                    className="whitespace-nowrap"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default DiscoverPeople;
