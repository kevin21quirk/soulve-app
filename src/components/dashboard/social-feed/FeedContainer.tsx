
import React from "react";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useErrorHandler } from "@/contexts/ErrorContext";
import { useScreenReader } from "@/hooks/useAccessibility";
import { useRealTimeNotifications } from "@/components/ui/real-time-notifications";
import { useIsMobile } from "@/components/ui/mobile-optimized";
import FeedHeader from "./FeedHeader";
import FeedFilters from "./FeedFilters";
import FeedContent from "./FeedContent";
import { ErrorState } from "@/components/ui/error-states";

/**
 * Main container component for the social feed
 * Manages state and coordinates between child components
 */
const FeedContainer = React.memo(() => {
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

  const handleRefresh = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      announce("Feed refreshed");
      addNotification({
        type: "help",
        title: "Feed Updated",
        message: "Your feed has been refreshed with the latest posts",
      });
    } catch (error) {
      reportError(error as Error, "feed refresh");
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    announce(`Filter changed to ${filter}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <FeedHeader onPostCreated={handlePostCreated} />
      
      <FeedFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        postCounts={getPostCounts()}
        isMobile={isMobile}
      />

      <FeedContent
        posts={filteredPosts}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onLike={handleLike}
        onShare={handleShare}
        onRespond={handleRespond}
        onRefresh={handleRefresh}
        isMobile={isMobile}
      />
    </div>
  );
});

FeedContainer.displayName = "FeedContainer";

export default FeedContainer;
