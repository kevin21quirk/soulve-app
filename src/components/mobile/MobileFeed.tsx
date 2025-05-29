
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useFeedInteractions } from "@/hooks/useFeedInteractions";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";
import MobileCreatePost from "./MobileCreatePost";
import MobileStories from "./MobileStories";
import MobileFeedFilters from "./MobileFeedFilters";
import MobileFeedContent from "./MobileFeedContent";

const MobileFeed = () => {
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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="bg-gray-50 min-h-screen">
        {/* Stories Section */}
        <MobileStories />
        
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
      </div>
    </PullToRefresh>
  );
};

export default MobileFeed;
