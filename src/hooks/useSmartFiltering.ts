
import { useMemo } from "react";
import { FeedPost } from "@/types/feed";

export const useSmartFiltering = (filteredPosts: FeedPost[], activeTab: string) => {
  const getSmartFilteredPosts = useMemo(() => {
    let posts = filteredPosts;
    
    console.log("Smart filtering debug:", {
      inputPosts: posts.length,
      activeTab,
      posts: posts.map(p => ({ id: p.id, title: p.title, category: p.category, urgency: p.urgency }))
    });
    
    switch (activeTab) {
      case "for-you":
        // AI-curated feed based on user interests and engagement
        return posts.sort((a, b) => {
          const aScore = (a.likes * 0.3) + (a.responses * 0.5) + (a.shares * 0.2);
          const bScore = (b.likes * 0.3) + (b.responses * 0.5) + (b.shares * 0.2);
          return bScore - aScore;
        });
      
      case "urgent":
        const urgentPosts = posts.filter(p => p.urgency === "high" || p.urgency === "urgent");
        console.log("Urgent posts filtered:", urgentPosts.length);
        return urgentPosts;
      
      case "nearby":
        // Filter by location proximity (mock implementation)
        const nearbyPosts = posts.filter(p => p.location.includes("London") || p.location.includes("Downtown"));
        console.log("Nearby posts filtered:", nearbyPosts.length);
        return nearbyPosts;
      
      case "trending":
        return posts.sort((a, b) => {
          const now = Date.now();
          const aAge = now - new Date(a.timestamp).getTime();
          const bAge = now - new Date(b.timestamp).getTime();
          const aTrending = (a.likes + a.shares) / (aAge / 3600000); // per hour
          const bTrending = (b.likes + b.shares) / (bAge / 3600000);
          return bTrending - aTrending;
        });
      
      case "following":
        // For now, return all posts since we don't have a following system implemented
        console.log("Following tab - returning all posts");
        return posts;
      
      default:
        console.log("Default case - returning all posts");
        return posts;
    }
  }, [filteredPosts, activeTab]);

  console.log("Smart filtering result:", {
    activeTab,
    outputPosts: getSmartFilteredPosts.length
  });

  return getSmartFilteredPosts;
};
