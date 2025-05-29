
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useFeedInteractions } from "@/hooks/useFeedInteractions";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";
import MobileCreatePost from "./MobileCreatePost";
import MobileStories from "./MobileStories";
import MobileFeedFilters from "./MobileFeedFilters";
import MobileFeedContent from "./MobileFeedContent";
import MobileFloatingActionButton from "./MobileFloatingActionButton";
import MobileQuickStats from "./MobileQuickStats";
import MobileSwipeGestures from "./MobileSwipeGestures";
import MobileLiveUpdates from "./MobileLiveUpdates";
import { useState } from "react";

const MobileFeed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const {
    filteredPosts,
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
  } = useSocialFeed();

  const {
    activeFilters,
    refreshing,
    handleFilterToggle,
    handleClearFilters,
    handleRefresh,
    filterPosts,
    getPostCounts,
  } = useFeedInteractions();

  const finalFilteredPosts = filterPosts(filteredPosts);
  const postCounts = getPostCounts(filteredPosts);

  const handleQuickPost = (type: string) => {
    console.log("Quick post action:", type);
    setShowCreatePost(true);
  };

  const handleSwipeLeft = () => {
    console.log("Swiped left - could navigate to discover");
  };

  const handleSwipeRight = () => {
    console.log("Swiped right - could navigate to messages");
  };

  const handleSwipeUp = () => {
    setShowCreatePost(true);
  };

  const handleLiveUpdate = () => {
    handleRefresh();
  };

  return (
    <MobileSwipeGestures
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="bg-gray-50 min-h-screen">
          {/* Live Updates Indicator */}
          <MobileLiveUpdates onNewUpdate={handleLiveUpdate} />
          
          {/* Stories Section */}
          <MobileStories />
          
          {/* Quick Stats */}
          <MobileQuickStats />
          
          {/* Create Post */}
          <div className="px-4 py-3">
            <MobileCreatePost onPostCreated={handlePostCreated} />
          </div>

          {/* Feed Filters */}
          <MobileFeedFilters
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onClearFilters={handleClearFilters}
            postCounts={postCounts}
          />

          {/* Feed Content */}
          <div className="px-4">
            <MobileFeedContent
              posts={finalFilteredPosts}
              isLoading={isLoading}
              onLike={handleLike}
              onShare={handleShare}
              onRespond={handleRespond}
              onBookmark={handleBookmark}
              onReaction={handleReaction}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onCommentReaction={handleCommentReaction}
            />
          </div>

          {/* Floating Action Button */}
          <MobileFloatingActionButton onQuickPost={handleQuickPost} />
        </div>
      </PullToRefresh>
    </MobileSwipeGestures>
  );
};

export default MobileFeed;
