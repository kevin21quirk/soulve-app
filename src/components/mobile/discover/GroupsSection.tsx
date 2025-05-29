
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface GroupsSectionProps {
  onJoinGroup: (groupId: string) => void;
}

const GroupsSection = ({ onJoinGroup }: GroupsSectionProps) => {
  const { suggestedGroups } = useConnections();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Users className="h-5 w-5 text-green-500" />
          <span>Groups to Join</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedGroups.slice(0, 2).map((group) => (
          <div key={group.id} className="p-3 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{group.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {group.memberCount} members
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {group.category}
                  </Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="gradient"
                onClick={() => onJoinGroup(group.id)}
              >
                Join
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GroupsSection;
