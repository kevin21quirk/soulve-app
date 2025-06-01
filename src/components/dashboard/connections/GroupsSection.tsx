
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users2, MapPin, Calendar, UserPlus, UserMinus } from "lucide-react";
import { CommunityGroup } from "@/types/groups";

interface GroupsSectionProps {
  suggestedGroups: CommunityGroup[];
  myGroups: CommunityGroup[];
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

const GroupsSection = ({ suggestedGroups, myGroups, onJoinGroup, onLeaveGroup }: GroupsSectionProps) => {
  const renderGroupCard = (group: CommunityGroup, isJoined: boolean) => (
    <Card key={group.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={group.coverImage} alt={group.name} />
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users2 className="h-4 w-4" />
                  <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{group.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{group.activity}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {group.category}
            </Badge>
            {group.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {group.recentActivity}
            </div>
            {isJoined ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLeaveGroup(group.id)}
              >
                <UserMinus className="h-4 w-4 mr-1" />
                Leave
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={() => onJoinGroup(group.id)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* My Groups */}
      {myGroups.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">My Groups ({myGroups.length})</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myGroups.map(group => renderGroupCard(group, true))}
          </div>
        </div>
      )}

      {/* Suggested Groups */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggested Groups</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestedGroups.map(group => renderGroupCard(group, false))}
        </div>
      </div>
    </div>
  );
};

export default GroupsSection;
