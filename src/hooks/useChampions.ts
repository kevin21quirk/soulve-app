
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommunityChampion } from "@/types/champions";
import { mockChampions } from "@/data/mockChampions";

export const useChampions = () => {
  const { toast } = useToast();
  const [champions] = useState<CommunityChampion[]>(mockChampions);
  const [followedChampions, setFollowedChampions] = useState<string[]>([]);

  const handleFollowChampion = (championId: string) => {
    setFollowedChampions(prev => 
      prev.includes(championId) 
        ? prev.filter(id => id !== championId)
        : [...prev, championId]
    );
    
    const isFollowing = !followedChampions.includes(championId);
    toast({
      title: isFollowing ? "Following champion!" : "Unfollowed champion",
      description: isFollowing 
        ? "You'll receive updates from this community champion." 
        : "You'll no longer receive updates from this champion.",
    });
  };

  return {
    champions,
    followedChampions,
    handleFollowChampion,
  };
};
