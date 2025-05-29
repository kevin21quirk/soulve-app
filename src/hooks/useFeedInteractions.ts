
import { useState, useCallback } from "react";
import { FeedPost } from "@/types/feed";

export const useFeedInteractions = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleFilterToggle = useCallback((filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    // In a real app, this would trigger a data refetch
    window.location.reload();
  }, []);

  const filterPosts = useCallback((posts: FeedPost[]) => {
    if (activeFilters.length === 0) return posts;

    return posts.filter(post => {
      return activeFilters.some(filter => {
        switch (filter) {
          case "urgent":
            return post.urgency === "urgent" || post.urgency === "high";
          case "nearby":
            return post.location.includes("area") || post.location.includes("Downtown");
          case "recent":
            return post.timestamp.includes("min") || post.timestamp.includes("hour");
          case "trending":
            return (post.likes + post.shares + post.responses) > 10;
          default:
            return false;
        }
      });
    });
  }, [activeFilters]);

  const getPostCounts = useCallback((posts: FeedPost[]) => {
    return {
      urgent: posts.filter(p => p.urgency === "urgent" || p.urgency === "high").length,
      nearby: posts.filter(p => p.location.includes("area") || p.location.includes("Downtown")).length,
      recent: posts.filter(p => p.timestamp.includes("min") || p.timestamp.includes("hour")).length,
      trending: posts.filter(p => (p.likes + p.shares + p.responses) > 10).length,
    };
  }, []);

  return {
    activeFilters,
    refreshing,
    handleFilterToggle,
    handleClearFilters,
    handleRefresh,
    filterPosts,
    getPostCounts,
  };
};
