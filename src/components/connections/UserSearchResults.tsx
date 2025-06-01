
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import ConnectionButton from "./ConnectionButton";

interface SearchedUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
}

interface UserSearchResultsProps {
  users: SearchedUser[];
  isLoading: boolean;
  onUserClick?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

const UserSearchResults = ({ 
  users, 
  isLoading, 
  onUserClick, 
  onMessage 
}: UserSearchResultsProps) => {
  const getDisplayName = (user: SearchedUser) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous User';
  };

  const getInitials = (user: SearchedUser) => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AU';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar 
                className="h-12 w-12 cursor-pointer" 
                onClick={() => onUserClick?.(user.id)}
              >
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{getInitials(user)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => onUserClick?.(user.id)}
                >
                  {getDisplayName(user)}
                </h3>
                
                {user.location && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.location}
                  </div>
                )}
                
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                
                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {user.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.interests.slice(0, 2).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {user.interests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.interests.length - 2} interests
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <ConnectionButton 
                  userId={user.id}
                  variant="compact"
                  onMessage={() => onMessage?.(user.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserSearchResults;
