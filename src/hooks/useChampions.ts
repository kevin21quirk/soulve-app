
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommunityChampion } from "@/types/champions";
import { mockCommunityChampions } from "@/data/mockChampions";

export const useChampions = () => {
  const { toast } = useToast();
  const [champions] = useState<CommunityChampion[]>(mockCommunityChampions);
  const [followedChampions, setFollowedChampions] = useState<string[]>([]);

  const handleFollowChampion = (championId: string) => {
    const champion = champions.find(c => c.id === championId);
    if (!champion) return;

    if (followedChampions.includes(championId)) {
      setFollowedChampions(prev => prev.filter(id => id !== championId));
      toast({
        title: "Unfollowed champion",
        description: `You're no longer following ${champion.name}.`,
      });
    } else {
      setFollowedChampions(prev => [...prev, championId]);
      toast({
        title: "Following champion! ⭐",
        description: `You're now following ${champion.name}. You'll see their updates in your feed.`,
      });
    }
  };

  return {
    champions,
    followedChampions,
    handleFollowChampion,
  };
};
