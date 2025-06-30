
import { useState } from "react";
import { FeedPost } from "@/types/feed";
import { mockPosts } from "@/data/mockPosts";
import { useFeedFilters } from "./useFeedFilters";
import { usePostInteractions } from "./usePostInteractions";
import { usePostCreation } from "./usePostCreation";
import { useInteractionTracking } from "./useInteractionTracking";

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
 * @returns {Function} returns.handleBookmark - Handler for post bookmarking
 * @returns {Function} returns.handleReaction - Handler for post reactions
 * @returns {Function} returns.handleAddComment - Handler for adding comments
 * @returns {Function} returns.handleLikeComment - Handler for liking comments
 * @returns {Function} returns.handleCommentReaction - Handler for comment reactions
 * @returns {Function} returns.getPostCounts - Function to get post counts by category
 * 
 * @example
 * const {
 *   filteredPosts,
 *   activeFilter,
 *   setActiveFilter,
 *   handleLike,
 *   handleReaction
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
    handleLike: originalHandleLike,
    handleShare: originalHandleShare,
    handleRespond,
    handleBookmark,
    handleReaction,
    handleAddComment: originalHandleAddComment,
    handleLikeComment,
    handleCommentReaction,
  } = usePostInteractions();

  const {
    isLoading,
    handlePostCreated,
  } = usePostCreation(setPosts);

  const {
    trackPostLike,
    trackPostShare,
    trackPostComment,
    trackPostView,
  } = useInteractionTracking();

  // Enhanced handlers with interaction tracking
  const handleLike = async (postId: string) => {
    await originalHandleLike(postId);
    await trackPostLike(postId);
  };

  const handleShare = async (postId: string) => {
    await originalHandleShare(postId);
    await trackPostShare(postId);
  };

  const handleAddComment = async (postId: string, content: string) => {
    await originalHandleAddComment(postId, content);
    await trackPostComment(postId);
  };

  // Track post views when posts are displayed
  const trackPostViews = async (posts: FeedPost[]) => {
    posts.forEach(async (post) => {
      await trackPostView(post.id);
    });
  };

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
    handleBookmark,
    handleReaction,
    handleAddComment,
    handleLikeComment,
    handleCommentReaction,
    getPostCounts,
    trackPostViews,
  };
};
