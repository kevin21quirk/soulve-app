
import { useState } from "react";
import { FeedPost } from "@/types/feed";
import { mockPosts } from "@/data/mockPosts";
import { useFeedFilters } from "./useFeedFilters";
import { usePostInteractions } from "./usePostInteractions";
import { usePostCreation } from "./usePostCreation";

/**
 * Custom hook for managing social feed state and operations
 * 
 * @description
 * This hook provides a centralized interface for all social feed operations including
 * filtering, searching, post creation, and user interactions. It combines multiple
 * specialized hooks to provide a clean API for the feed components.
 * 
 * @returns {Object} Social feed state and handlers
 * @returns {FeedPost[]} returns.posts - All posts in the feed
 * @returns {FeedPost[]} returns.filteredPosts - Posts filtered by current criteria
 * @returns {string} returns.activeFilter - Currently active filter
 * @returns {Function} returns.setActiveFilter - Function to change active filter
 * @returns {string} returns.searchQuery - Current search query
 * @returns {Function} returns.setSearchQuery - Function to update search query
 * @returns {boolean} returns.isLoading - Loading state for post operations
 * @returns {Function} returns.handlePostCreated - Handler for new post creation
 * @returns {Function} returns.handleLike - Handler for post likes
 * @returns {Function} returns.handleShare - Handler for post sharing
 * @returns {Function} returns.handleRespond - Handler for post responses
 * @returns {Function} returns.getPostCounts - Function to get post counts by category
 * 
 * @example
 * const {
 *   filteredPosts,
 *   activeFilter,
 *   setActiveFilter,
 *   handleLike
 * } = useSocialFeed();
 */
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
