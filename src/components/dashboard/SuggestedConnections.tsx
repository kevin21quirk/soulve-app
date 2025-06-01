
import { UserPlus } from "lucide-react";
import { DatabaseProfile } from "@/services/realConnectionsService";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuggestedConnectionsProps {
  suggestedConnections: DatabaseProfile[];
  onSendRequest: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
}

const SuggestedConnections = ({ 
  suggestedConnections, 
  onSendRequest, 
  getTrustScoreColor 
}: SuggestedConnectionsProps) => {
  if (suggestedConnections.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Suggested Connections (0)
        </h3>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No suggestions available right now. Check back later!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <UserPlus className="h-5 w-5 mr-2" />
        Suggested Connections ({suggestedConnections.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {suggestedConnections.map((profile) => {
          const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
          
          return (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || ''} alt={displayName} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">{displayName}</h4>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      {profile.location || 'Location not specified'}
                    </p>
                    
                    {profile.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}
                    
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => onSendRequest(profile.id)}
                        className="flex-1"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedConnections;
