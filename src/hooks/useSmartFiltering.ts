
import { useMemo } from "react";
import { FeedPost } from "@/types/feed";

export const useSmartFiltering = (filteredPosts: FeedPost[], activeTab: string) => {
  const getSmartFilteredPosts = useMemo(() => {
    let posts = filteredPosts;
    
    switch (activeTab) {
      case "for-you":
        // AI-curated feed based on user interests and engagement
        return posts.sort((a, b) => {
          const aScore = (a.likes * 0.3) + (a.responses * 0.5) + (a.shares * 0.2);
          const bScore = (b.likes * 0.3) + (b.responses * 0.5) + (b.shares * 0.2);
          return bScore - aScore;
        });
      
      case "urgent":
        return posts.filter(p => p.urgency === "high" || p.urgency === "urgent");
      
      case "nearby":
        // Filter by location proximity (mock implementation)
        return posts.filter(p => p.location.includes("London") || p.location.includes("Downtown"));
      
      case "trending":
        return posts.sort((a, b) => {
          const now = Date.now();
          const aAge = now - new Date(a.timestamp).getTime();
          const bAge = now - new Date(b.timestamp).getTime();
          const aTrending = (a.likes + a.shares) / (aAge / 3600000); // per hour
          const bTrending = (b.likes + b.shares) / (bAge / 3600000);
          return bTrending - aTrending;
        });
      
      default:
        return posts;
    }
  }, [filteredPosts, activeTab]);

  return getSmartFilteredPosts;
};
