
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useSmartFiltering } from "@/hooks/useSmartFiltering";
import FeedHeader from "./social-feed/FeedHeader";
import FeedFilters from "./social-feed/FeedFilters";
import SmartFeedTabs from "./social-feed/SmartFeedTabs";
import FeedControls from "./social-feed/FeedControls";
import FeedTabContent from "./social-feed/FeedTabContent";
import EnhancedSearchBar from "./search/EnhancedSearchBar";

const EnhancedSocialFeed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showSearch, setShowSearch] = useState(false);

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

  const smartFilteredPosts = useSmartFiltering(filteredPosts, activeTab);
  const postCounts = getPostCounts();
  
  // Calculate urgent posts count
  const urgentPostsCount = filteredPosts.filter(p => p.urgency === "high" || p.urgency === "urgent").length;

  return (
    <div className="space-y-6">
      <FeedHeader 
        onSearch={() => setShowSearch(!showSearch)}
        onFilter={() => setShowFilters(!showFilters)}
        totalPosts={filteredPosts.length}
        urgentPosts={urgentPostsCount}
      />

      {showSearch && (
        <Card>
          <CardContent className="p-4">
            <EnhancedSearchBar
              onSearch={setSearchQuery}
              placeholder="Search posts, people, locations, skills..."
              showTrending={true}
            />
          </CardContent>
        </Card>
      )}

      <SmartFeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <FeedControls
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        activeFilter={activeFilter}
        postsCount={smartFilteredPosts.length}
        urgentPostsCount={urgentPostsCount}
        activeTab={activeTab}
      />

      {showFilters && (
        <FeedFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          postCounts={postCounts}
          onClose={() => setShowFilters(false)}
        />
      )}

      <FeedTabContent
        activeTab={activeTab}
        posts={smartFilteredPosts}
        isLoading={isLoading}
        onPostCreated={handlePostCreated}
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
  );
};

export default EnhancedSocialFeed;
