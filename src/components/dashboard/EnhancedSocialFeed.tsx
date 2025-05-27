
import React, { useState } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import FeedFilters from "./FeedFilters";
import CreatePost from "./CreatePost";
import SearchBar from "./SearchBar";
import FeedPostCard from "./FeedPostCard";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useErrorHandler } from "@/contexts/ErrorContext";
import { useDebounce, useLazyLoading } from "@/hooks/usePerformanceOptimization";
import { useScreenReader, useKeyboardNavigation } from "@/hooks/useAccessibility";
import { useRealTimeNotifications } from "@/components/ui/real-time-notifications";
import { 
  MobileSearchFilter, 
  MobileActionBar, 
  PullToRefresh,
  useIsMobile 
} from "@/components/ui/mobile-optimized";
import { PostSkeleton } from "@/components/dashboard/PostSkeleton";
import { ErrorState, NetworkStatus } from "@/components/ui/error-states";
import { LoadingSpinner } from "@/components/ui/skeleton-variants";
import { Share, Heart, MessageSquare } from "lucide-react";

const EnhancedSocialFeed = React.memo(() => {
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
    getPostCounts,
  } = useSocialFeed();
  
  const { reportError } = useErrorHandler();
  const { announce } = useScreenReader();
  const { addNotification } = useRealTimeNotifications();
  const isMobile = useIsMobile();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Performance optimizations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { ref: loadMoreRef, isIntersecting } = useLazyLoading();

  // Accessibility
  const { activeIndex } = useKeyboardNavigation(filteredPosts, (index) => {
    const post = filteredPosts[index];
    announce(`Selected post: ${post.title} by ${post.author}`);
  });

  const handleRefresh = async () => {
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      announce("Feed refreshed");
      addNotification({
        type: "help",
        title: "Feed Updated",
        message: "Your feed has been refreshed with the latest posts",
      });
    } catch (error) {
      setError("Failed to refresh feed");
      reportError(error as Error, "feed refresh");
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    announce(`Filter changed to ${filter}`);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const mobileActions = isMobile ? [
    {
      label: "Like",
      icon: Heart,
      onClick: () => {
        if (filteredPosts[0]) {
          handleLike(filteredPosts[0].id);
        }
      },
    },
    {
      label: "Share",
      icon: Share,
      onClick: () => {
        if (filteredPosts[0]) {
          handleShare(filteredPosts[0].id);
        }
      },
    },
    {
      label: "Respond",
      icon: MessageSquare,
      onClick: () => {
        if (filteredPosts[0]) {
          handleRespond(filteredPosts[0].id);
        }
      },
    },
  ] : [];

  if (error) {
    return (
      <ErrorState
        title="Feed Error"
        message={error}
        type="general"
        onRetry={() => {
          setError(null);
          handleRefresh();
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <NetworkStatus />
      
      <div className="space-y-6 animate-fade-in">
        {/* Mobile search and filter */}
        <MobileSearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterToggle={() => setShowMobileFilters(!showMobileFilters)}
          showFilters={showMobileFilters}
        />

        {/* Desktop header */}
        {!isMobile && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h2>
            <p className="text-gray-600">See what your community needs and how you can help</p>
          </div>
        )}

        <CreatePost onPostCreated={handlePostCreated} />

        {/* Desktop filters and search */}
        {!isMobile && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <FeedFilters 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              postCounts={getPostCounts()}
            />
            
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder="Search posts, authors, locations..."
              className="w-full md:w-80"
            />
          </div>
        )}

        {/* Mobile filters overlay */}
        {isMobile && showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4">
              <FeedFilters 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                postCounts={getPostCounts()}
              />
            </div>
          </div>
        )}

        {/* Feed content with pull to refresh on mobile */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-4">
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => <PostSkeleton key={i} />)}
              </div>
            )}

            {!isLoading && filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className={`transition-all duration-200 ${
                  activeIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                tabIndex={0}
                role="article"
                aria-label={`Post by ${post.author}: ${post.title}`}
              >
                <FeedPostCard
                  post={post}
                  onLike={handleLike}
                  onShare={handleShare}
                  onRespond={handleRespond}
                />
              </div>
            ))}

            {/* Lazy loading trigger */}
            {!isLoading && filteredPosts.length > 0 && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isIntersecting && <LoadingSpinner />}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                {debouncedSearchQuery ? (
                  <>
                    <p className="text-gray-500 text-lg">No posts found matching "{debouncedSearchQuery}"</p>
                    <p className="text-gray-400">Try adjusting your search terms or filter.</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg">No posts found for this category.</p>
                    <p className="text-gray-400">Try selecting a different filter above.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </PullToRefresh>

        {/* Mobile action bar */}
        <MobileActionBar actions={mobileActions} />
      </div>
    </ErrorBoundary>
  );
});

EnhancedSocialFeed.displayName = "EnhancedSocialFeed";

export default EnhancedSocialFeed;
