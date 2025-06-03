
import { useState } from "react";
import { useRealSocialFeed } from "@/hooks/useRealSocialFeed";
import { useRealPostCreation } from "@/hooks/useRealPostCreation";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";
import MobileCreatePost from "./MobileCreatePost";
import MobileStories from "./MobileStories";
import MobileFeedFilters from "./MobileFeedFilters";
import MobileFeedContent from "./MobileFeedContent";
import MobileFloatingActionButton from "./MobileFloatingActionButton";
import MobileQuickStats from "./MobileQuickStats";
import MobileSwipeGestures from "./MobileSwipeGestures";
import MobileLiveUpdates from "./MobileLiveUpdates";
import { transformSocialPostToFeedPost } from "@/utils/socialPostTransformers";

const MobileFeed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const {
    posts,
    loading,
    refreshing,
    refreshFeed,
    handleLike,
    handleShare,
    handleBookmark,
    handleAddComment,
  } = useRealSocialFeed();

  const { createPost } = useRealPostCreation();

  const handlePostCreated = async (formData: any) => {
    try {
      await createPost({
        title: formData.title || '',
        content: formData.description,
        category: formData.category,
        urgency: formData.urgency || 'medium',
        location: formData.location,
        tags: formData.tags || [],
        visibility: formData.visibility || 'public',
        media_urls: []
      });
      
      setShowCreatePost(false);
      // Posts will auto-refresh via real-time subscription
      
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

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
    refreshFeed();
  };

  // Mock implementations for unused handlers (to maintain interface)
  const handleRespond = (postId: string) => {
    console.log("Respond to post:", postId);
  };

  const handleReaction = (postId: string, reactionType: string) => {
    console.log("React to post:", postId, reactionType);
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    console.log("Like comment:", postId, commentId);
  };

  const handleCommentReaction = (postId: string, commentId: string, reactionType: string) => {
    console.log("React to comment:", postId, commentId, reactionType);
  };

  // Transform SocialPost to FeedPost for the mobile feed
  const transformedPosts = posts.map(transformSocialPostToFeedPost);

  // Simple filtering for now - can be enhanced later
  const filteredPosts = transformedPosts;
  const activeFilters: string[] = [];
  const postCounts = {
    all: posts.length,
    'help-needed': posts.filter(p => p.category === 'help-needed').length,
    'help-offered': posts.filter(p => p.category === 'help-offered').length,
    'success-story': posts.filter(p => p.category === 'success-story').length,
  };

  const handleFilterToggle = (filter: string) => {
    console.log("Toggle filter:", filter);
  };

  const handleClearFilters = () => {
    console.log("Clear filters");
  };

  return (
    <MobileSwipeGestures
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
    >
      <PullToRefresh onRefresh={() => Promise.resolve(refreshFeed())}>
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
              posts={filteredPosts}
              isLoading={loading}
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
