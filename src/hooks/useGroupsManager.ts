
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Group } from "@/types/connections";
import { mockGroups } from "@/data/mockConnections";

export const useGroupsManager = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(mockGroups);

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, isJoined: true, memberCount: group.memberCount + 1 } : group
      )
    );
    toast({
      title: "Joined group!",
      description: "You've successfully joined the group and can now participate.",
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, isJoined: false, memberCount: group.memberCount - 1 } : group
      )
    );
    toast({
      title: "Left group",
      description: "You've left the group.",
    });
  };

  const myGroups = groups.filter(g => g.isJoined);
  const suggestedGroups = groups.filter(g => !g.isJoined);

  return {
    groups,
    myGroups,
    suggestedGroups,
    handleJoinGroup,
    handleLeaveGroup,
  };
};
