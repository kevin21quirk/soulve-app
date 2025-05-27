
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Lock, Globe, Plus, Search } from "lucide-react";
import { Group } from "@/types/connections";

interface GroupsSectionProps {
  suggestedGroups: Group[];
  myGroups: Group[];
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

const GroupsSection = ({ 
  suggestedGroups, 
  myGroups, 
  onJoinGroup, 
  onLeaveGroup 
}: GroupsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Header with Create Group button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Groups</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Your Groups ({myGroups.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group} 
                onAction={onLeaveGroup}
                actionLabel="Leave"
                variant="joined"
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Suggested Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedGroups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onAction={onJoinGroup}
              actionLabel="Join Group"
              variant="suggested"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface GroupCardProps {
  group: Group;
  onAction: (groupId: string) => void;
  actionLabel: string;
  variant: "joined" | "suggested";
}

const GroupCard = ({ group, onAction, actionLabel, variant }: GroupCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg">
        {group.coverImage && (
          <img 
            src={group.coverImage} 
            alt={group.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-2 right-2">
          {group.isPrivate ? (
            <Lock className="h-4 w-4 text-white" />
          ) : (
            <Globe className="h-4 w-4 text-white" />
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg">{group.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{group.memberCount.toLocaleString()} members</span>
            </div>
            {group.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{group.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={group.adminAvatar} />
              <AvatarFallback className="text-xs">
                {group.adminName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
              Admin: {group.adminName}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {group.category}
            </Badge>
            {group.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={() => onAction(group.id)}
            className="w-full"
            variant={variant === "joined" ? "outline" : "default"}
            size="sm"
          >
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupsSection;
