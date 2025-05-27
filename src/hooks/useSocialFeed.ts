
import { useState } from "react";
import { FeedPost } from "@/types/feed";
import { mockPosts } from "@/data/mockPosts";
import { useFeedFilters } from "./useFeedFilters";
import { usePostInteractions } from "./usePostInteractions";
import { usePostCreation } from "./usePostCreation";

export const useSocialFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);

  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredPosts,
    getPostCounts,
  } = useFeedFilters(posts);

  const {
    handleLike,
    handleShare,
    handleRespond,
  } = usePostInteractions(posts, setPosts);

  const {
    isLoading,
    handlePostCreated,
  } = usePostCreation(setPosts);

  return {
    posts,
    filteredPosts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    handlePostCreated,
    handleLike,
    handleShare,
    handleRespond,
    getPostCounts,
  };
};
