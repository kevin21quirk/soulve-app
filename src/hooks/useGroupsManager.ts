
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommunityGroup } from "@/types/groups";
import { mockGroups } from "@/data/mockGroups";

export const useGroupsManager = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>(mockGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['1', '3']);

  const myGroups = groups.filter(group => joinedGroupIds.includes(group.id));
  const suggestedGroups = groups.filter(group => !joinedGroupIds.includes(group.id));

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroupIds(prev => [...prev, groupId]);
    toast({
      title: "Joined group!",
      description: "You've successfully joined the community group.",
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
    toast({
      title: "Left group",
      description: "You've left the community group.",
    });
  };

  return {
    groups,
    myGroups,
    suggestedGroups,
    handleJoinGroup,
    handleLeaveGroup,
  };
};
