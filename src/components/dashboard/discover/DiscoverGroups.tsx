
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Lock, Globe, Calendar, UserPlus } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface DiscoverGroupsProps {
  searchQuery: string;
}

const DiscoverGroups = ({ searchQuery }: DiscoverGroupsProps) => {
  const { suggestedGroups, handleJoinGroup } = useConnections();

  const filteredGroups = suggestedGroups.filter(group => {
    if (!searchQuery) return true;
    return group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-500" />
          <span>Discover Groups ({filteredGroups.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No groups found matching your search.</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {group.coverImage && (
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <img 
                    src={group.coverImage} 
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{group.name}</h4>
                      {group.isPrivate ? (
                        <Lock className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{group.memberCount} members</span>
                      </div>
                      {group.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{group.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Active {group.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {group.category}
                      </Badge>
                      {group.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={group.adminAvatar} 
                      alt={group.adminName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500">Admin: {group.adminName}</span>
                  </div>
                  
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleJoinGroup(group.id)}
                    className="whitespace-nowrap"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {group.isPrivate ? 'Request to Join' : 'Join Group'}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default DiscoverGroups;
