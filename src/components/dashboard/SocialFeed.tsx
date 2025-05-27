
import React, { useMemo, useCallback } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import FeedFilters from "./FeedFilters";
import CreatePost from "./CreatePost";
import EnhancedSearchBar from "./search/EnhancedSearchBar";
import PostSkeleton from "./PostSkeleton";
import FeedPostCard from "./FeedPostCard";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useErrorHandler } from "@/contexts/ErrorContext";

const SocialFeed = React.memo(() => {
  const {
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
  } = useSocialFeed();
  
  const { reportError } = useErrorHandler();

  const postCounts = useMemo(() => getPostCounts(), [getPostCounts]);

  const handleFilterChange = useCallback((filter: string) => {
    try {
      setActiveFilter(filter);
    } catch (error) {
      reportError(error as Error, "filter change");
    }
  }, [setActiveFilter, reportError]);

  const handleSearchChange = useCallback((query: string) => {
    try {
      setSearchQuery(query);
    } catch (error) {
      reportError(error as Error, "search");
    }
  }, [setSearchQuery, reportError]);

  const renderSkeletons = useMemo(() => (
    <div className="space-y-4">
      {[1, 2].map((i) => <PostSkeleton key={i} />)}
    </div>
  ), []);

  const renderEmptyState = useMemo(() => (
    <div className="text-center py-12 animate-fade-in">
      {searchQuery ? (
        <>
          <p className="text-gray-500 text-lg">No posts found matching "{searchQuery}"</p>
          <p className="text-gray-400">Try adjusting your search terms or filter.</p>
        </>
      ) : (
        <>
          <p className="text-gray-500 text-lg">No posts found for this category.</p>
          <p className="text-gray-400">Try selecting a different filter above.</p>
        </>
      )}
    </div>
  ), [searchQuery]);

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h2>
          <p className="text-gray-600">See what your community needs and how you can help</p>
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <FeedFilters 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            postCounts={postCounts}
          />
          
          <EnhancedSearchBar 
            onSearch={handleSearchChange}
            placeholder="Search posts, authors, locations..."
            className="w-full md:w-80"
          />
        </div>

        <div className="space-y-4">
          {isLoading && renderSkeletons}

          {!isLoading && filteredPosts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onShare={handleShare}
              onRespond={handleRespond}
              onBookmark={handleBookmark}
              onReaction={handleReaction}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onCommentReaction={handleCommentReaction}
            />
          ))}
        </div>

        {!isLoading && filteredPosts.length === 0 && renderEmptyState}
      </div>
    </ErrorBoundary>
  );
});

SocialFeed.displayName = "SocialFeed";

export default SocialFeed;
