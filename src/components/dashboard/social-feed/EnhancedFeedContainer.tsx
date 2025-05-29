
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, WifiOff, Zap, TrendingUp, MapPin, Users, Sparkles } from "lucide-react";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { useRealTimeFeed } from "@/hooks/useRealTimeFeed";
import AdvancedFeedSearch from "./AdvancedFeedSearch";
import RealTimeNotifications from "./RealTimeNotifications";
import FeedContent from "./FeedContent";
import CreatePost from "../CreatePost";
import SmartRecommendations from "../SmartRecommendations";

interface SearchFilters {
  query: string;
  categories: string[];
  urgency: string[];
  location: string;
  dateRange: string;
  author: string;
  tags: string[];
}

const EnhancedFeedContainer = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  
  const {
    filteredPosts,
    activeFilter,
    setActiveFilter,
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
    posts: realTimePosts,
    isConnected,
    addPost,
  } = useRealTimeFeed(filteredPosts);

  // Apply search filters to posts
  const getFilteredPosts = () => {
    let posts = realTimePosts;

    if (searchFilters) {
      posts = posts.filter(post => {
        // Text search
        if (searchFilters.query) {
          const query = searchFilters.query.toLowerCase();
          const matchesText = 
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query) ||
            post.author.toLowerCase().includes(query);
          if (!matchesText) return false;
        }

        // Category filter
        if (searchFilters.categories.length > 0) {
          if (!searchFilters.categories.includes(post.category)) return false;
        }

        // Urgency filter
        if (searchFilters.urgency.length > 0) {
          if (!post.urgency || !searchFilters.urgency.includes(post.urgency)) return false;
        }

        // Location filter
        if (searchFilters.location) {
          const location = searchFilters.location.toLowerCase();
          if (!post.location?.toLowerCase().includes(location)) return false;
        }

        // Author filter
        if (searchFilters.author) {
          const author = searchFilters.author.toLowerCase();
          if (!post.author.toLowerCase().includes(author)) return false;
        }

        // Tags filter
        if (searchFilters.tags.length > 0) {
          const postTags = post.tags || [];
          const hasMatchingTag = searchFilters.tags.some(tag => 
            postTags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      });
    }

    // Apply tab-specific filtering
    switch (activeTab) {
      case "urgent":
        return posts.filter(post => post.urgency === "urgent" || post.urgency === "high");
      case "nearby":
        return posts.filter(post => post.location && post.location.includes("area"));
      case "trending":
        return posts.sort((a, b) => (b.likes + b.shares + b.responses) - (a.likes + a.shares + a.responses));
      case "following":
        return posts.filter(post => post.author !== "You"); // Mock filter for followed users
      default:
        return posts;
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters(null);
  };

  const getTabConfig = (tabValue: string) => {
    switch (tabValue) {
      case "for-you":
        return { title: "For You", icon: Sparkles, color: "purple" };
      case "urgent":
        return { title: "Urgent", icon: Zap, color: "red" };
      case "nearby":
        return { title: "Nearby", icon: MapPin, color: "blue" };
      case "trending":
        return { title: "Trending", icon: TrendingUp, color: "green" };
      case "following":
        return { title: "Following", icon: Users, color: "purple" };
      default:
        return { title: "For You", icon: Sparkles, color: "purple" };
    }
  };

  const config = getTabConfig(activeTab);
  const filteredPostsForDisplay = getFilteredPosts();

  return (
    <div className="space-y-6">
      {/* Real-time Status & Notifications Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center space-x-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? "Live" : "Offline"}</span>
          </Badge>
          {searchFilters && (
            <Badge variant="outline" className="cursor-pointer" onClick={handleClearSearch}>
              Filters Active ({Object.values(searchFilters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length})
              <button className="ml-1">×</button>
            </Badge>
          )}
        </div>
        <RealTimeNotifications />
      </div>

      {/* Advanced Search */}
      <AdvancedFeedSearch onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Create Post */}
      <CreatePost onPostCreated={(post) => {
        handlePostCreated(post);
        addPost(post);
      }} />

      {/* Smart Recommendations */}
      <SmartRecommendations />

      {/* Enhanced Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="for-you" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Urgent</span>
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Nearby</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Following</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className={`border-${config.color}-200 bg-${config.color}-50/30`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center space-x-2 text-${config.color}-800`}>
                <config.icon className="h-5 w-5" />
                <span>{config.title}</span>
                <Badge variant="outline" className="ml-auto">
                  {filteredPostsForDisplay.length} posts
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeedContent
                posts={filteredPostsForDisplay}
                isLoading={isLoading}
                onLike={handleLike}
                onShare={handleShare}
                onRespond={handleRespond}
                onBookmark={handleBookmark}
                onReaction={handleReaction}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onCommentReaction={handleCommentReaction}
                emptyMessage={
                  searchFilters 
                    ? "No posts match your search criteria. Try adjusting your filters."
                    : `No ${config.title.toLowerCase()} posts available right now.`
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFeedContainer;
