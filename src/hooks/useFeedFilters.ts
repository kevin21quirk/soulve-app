
import { useState, useMemo } from "react";
import { FeedPost } from "@/types/feed";

export const useFeedFilters = (posts: FeedPost[]) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = activeFilter === "all" 
      ? posts 
      : posts.filter(post => post.category === activeFilter);

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [posts, activeFilter, searchQuery]);

  const getPostCounts = () => ({
    all: posts.length,
    "help-needed": posts.filter(p => p.category === "help-needed").length,
    "help-offered": posts.filter(p => p.category === "help-offered").length,
    "success-story": posts.filter(p => p.category === "success-story").length,
    urgent: posts.filter(p => p.urgency === "high" || p.urgency === "urgent").length,
    helpNeeded: posts.filter(p => p.category === "help-needed").length,
    helpOffered: posts.filter(p => p.category === "help-offered").length,
    successStory: posts.filter(p => p.category === "success-story").length,
  });

  return {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredPosts,
    getPostCounts,
  };
};
