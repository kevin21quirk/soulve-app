
import { useState, useEffect } from "react";
import { useRealSocialFeed } from "@/hooks/useRealSocialFeed";
import { PullToRefresh } from "@/components/ui/mobile/pull-to-refresh";
import { useFeedback } from "@/components/ui/UserFeedback";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";
import MobileOptimizations from "./MobileOptimizations";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import MobileCreatePost from "./MobileCreatePost";
import MobileStories from "./MobileStories";
import MobileFeedFilters from "./MobileFeedFilters";
import MobileFeedContent from "./MobileFeedContent";
import MobileFloatingActionButton from "./MobileFloatingActionButton";

const MobileFeedEnhanced = () => {
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

  const { showSuccess, showError } = useFeedback();

  // Enhanced campaign creation event handling
  useEffect(() => {
    const handleCampaignCreated = (event: CustomEvent) => {
      console.log('MobileFeed - Campaign created event received:', event.detail);
      showSuccess('Campaign Created', 'Your campaign has been created successfully!');
      setTimeout(() => {
        refreshFeed();
      }, 1000);
    };

    window.addEventListener('campaignCreated', handleCampaignCreated as EventListener);

    return () => {
      window.removeEventListener('campaignCreated', handleCampaignCreated as EventListener);
    };
  }, [refreshFeed, showSuccess]);

  const handlePostCreated = () => {
    console.log('MobileFeed - Post created, refreshing feed');
    setIsCreatingPost(false);
    showSuccess('Post Created', 'Your post has been shared with the community!');
    refreshFeed();
  };

  const handleRefresh = async () => {
    try {
      await refreshFeed();
      showSuccess('Feed Updated', 'Latest posts loaded successfully!');
    } catch (error) {
      showError('Refresh Failed', 'Could not update feed. Please try again.');
    }
  };

  const handleReaction = (postId: string, reactionType: string) => {
    console.log('MobileFeed - Reaction handled:', postId, reactionType);
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "all") return true;
    return post.category === activeFilter;
  });

  // Transform SocialPost to FeedPost format with enhanced error handling
  const transformedPosts = filteredPosts.map(post => {
    try {
      console.log('Transforming post with media_urls:', post.media_urls);
      
      const media = post.media_urls?.map((url: string, index: number) => ({
        id: `${post.id}_media_${index}`,
        type: url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.mov') || url.toLowerCase().includes('.webm') ? 'video' as const : 'image' as const,
        url: url,
        filename: url.split('/').pop() || `media_${index}`
      })) || [];

      return {
        id: post.id,
        author: post.author_name,
        avatar: post.author_avatar,
        title: post.title,
        description: post.content,
        category: post.category === "fundraising" ? "help-needed" : post.category as "help-needed" | "help-offered" | "success-story" | "announcement" | "question" | "recommendation" | "event" | "lost-found",
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
        media: media,
        status: post.status,
        visibility: "public" as const,
        reactions: [],
        comments: []
      };
    } catch (error) {
      console.error('Error transforming post:', post.id, error);
      showError('Post Error', 'Some posts could not be loaded properly.');
      return null;
    }
  }).filter(Boolean);

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

  const postCounts = {
    urgent: transformedPosts.filter(p => p?.urgency === 'urgent').length,
    nearby: transformedPosts.filter(p => p?.location).length,
    recent: transformedPosts.filter(p => p && new Date(p.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000).length,
    trending: transformedPosts.filter(p => p && p.likes > 5).length
  };

  if (loading && !posts.length) {
    return (
      <MobileOptimizations>
        <EnhancedLoadingState 
          type="skeleton" 
          message="Loading your community feed..."
          className="min-h-screen"
        />
      </MobileOptimizations>
    );
  }

  return (
    <MobileOptimizations>
      <div className="min-h-screen bg-gray-50">
        <PullToRefresh onRefresh={handleRefresh}>
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

            {/* Filters Section */}
            <MobileFeedFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeFilters={activeFilters}
              onFilterToggle={handleFilterToggle}
              onClearFilters={handleClearFilters}
              postCounts={postCounts}
            />

            {/* Enhanced Feed Content with better error handling */}
            <div className="px-4">
              {transformedPosts.length > 0 && (
                <div className="text-xs text-gray-500 mb-4 text-center">
                  {transformedPosts.length} {transformedPosts.length === 1 ? 'item' : 'items'} in feed
                  {transformedPosts.filter(p => p?.id.startsWith('campaign_')).length > 0 && (
                    <span className="ml-2">
                      ({transformedPosts.filter(p => p?.id.startsWith('campaign_')).length} campaigns)
                    </span>
                  )}
                </div>
              )}
            </div>

            <MobileFeedContent
              posts={transformedPosts.filter(Boolean)}
              isLoading={loading}
              onLike={handleLike}
              onShare={handleShare}
              onRespond={() => {}}
              onBookmark={handleBookmark}
              onReaction={handleReaction}
              onAddComment={handleAddComment}
              onLikeComment={() => {}}
              onRefresh={handleRefresh}
            />
          </div>
        </PullToRefresh>

        <MobileFloatingActionButton onQuickPost={handleQuickPost} />
        <PWAInstallPrompt />
      </div>
    </MobileOptimizations>
  );
};

export default MobileFeedEnhanced;
