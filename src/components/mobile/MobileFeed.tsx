
import { useState } from "react";
import { useRealSocialFeed } from "@/hooks/useRealSocialFeed";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";
import MobileCreatePost from "./MobileCreatePost";
import MobileStories from "./MobileStories";
import MobileFeedFilters from "./MobileFeedFilters";
import MobileFeedContent from "./MobileFeedContent";
import MobileFloatingActionButton from "./MobileFloatingActionButton";

const MobileFeed = () => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { 
    posts, 
    loading, 
    refreshing, 
    refreshFeed, 
    handleLike, 
    handleBookmark, 
    handleShare, 
    handleAddComment 
  } = useRealSocialFeed();

  const handlePostCreated = () => {
    console.log('MobileFeed - Post created, refreshing feed');
    setIsCreatingPost(false);
    // Immediate refresh to show the new post
    refreshFeed();
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "all") return true;
    return post.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PullToRefresh onRefresh={refreshFeed} disabled={refreshing}>
        <div className="space-y-4">
          {/* Stories Section */}
          <MobileStories />
          
          {/* Create Post Section */}
          {isCreatingPost ? (
            <div className="px-4">
              <MobileCreatePost onPostCreated={handlePostCreated} />
            </div>
          ) : (
            <div className="px-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">U</span>
                  </div>
                  <button
                    onClick={() => setIsCreatingPost(true)}
                    className="flex-1 text-left text-gray-500 bg-gray-50 rounded-full px-4 py-2 text-sm"
                  >
                    What's happening in your community?
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feed Filters */}
          <MobileFeedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            postCounts={{
              all: posts.length,
              "help-needed": posts.filter(p => p.category === "help-needed").length,
              "help-offered": posts.filter(p => p.category === "help-offered").length,
              "success-story": posts.filter(p => p.category === "success-story").length,
            }}
          />

          {/* Feed Content */}
          <MobileFeedContent
            posts={filteredPosts}
            loading={loading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleAddComment}
            onBookmark={handleBookmark}
            onReaction={(postId: string, reactionType: string) => {
              console.log('Mobile reaction:', postId, reactionType);
            }}
            onAddComment={handleAddComment}
            onLikeComment={(postId: string, commentId: string) => {
              console.log('Like comment:', postId, commentId);
            }}
          />
        </div>
      </PullToRefresh>

      {/* Floating Action Button */}
      <MobileFloatingActionButton
        onCreatePost={() => setIsCreatingPost(true)}
        onCreateCampaign={() => {
          console.log('Create campaign clicked');
        }}
      />
    </div>
  );
};

export default MobileFeed;
