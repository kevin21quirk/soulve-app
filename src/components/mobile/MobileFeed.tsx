
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
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
    refreshFeed();
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "all") return true;
    return post.category === activeFilter;
  });

  // Transform SocialPost to FeedPost format for MobileFeedContent
  const transformedPosts = filteredPosts.map(post => ({
    id: post.id,
    author: post.author_name,
    avatar: post.author_avatar,
    title: post.title,
    description: post.content,
    category: post.category as "help-needed" | "help-offered" | "success-story" | "announcement" | "question" | "recommendation" | "event" | "lost-found",
    timestamp: new Date(post.created_at).toLocaleDateString(),
    location: post.location || '',
    responses: post.comments_count,
    likes: post.likes_count,
    isLiked: post.is_liked,
    shares: post.shares_count,
    isBookmarked: post.is_bookmarked,
    isShared: false,
    urgency: post.urgency as 'low' | 'medium' | 'high' | 'urgent',
    tags: post.tags,
    media: post.media_urls.map(url => ({
      id: url,
      type: 'image' as const,
      url,
      filename: url.split('/').pop() || ''
    }))
  }));

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleQuickPost = (type: string) => {
    console.log('Quick post type:', type);
    setIsCreatingPost(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PullToRefresh onRefresh={async () => refreshFeed()}>
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
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onClearFilters={handleClearFilters}
            postCounts={{
              urgent: posts.filter(p => p.urgency === "urgent").length,
              nearby: posts.filter(p => p.location).length,
              recent: posts.filter(p => Date.now() - new Date(p.created_at).getTime() < 86400000).length,
              trending: posts.filter(p => p.likes_count > 5).length,
            }}
          />

          {/* Feed Content */}
          <MobileFeedContent
            posts={transformedPosts}
            isLoading={loading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={(postId: string) => handleAddComment(postId, "")}
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
        onQuickPost={handleQuickPost}
      />
    </div>
  );
};

export default MobileFeed;
