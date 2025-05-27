
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Zap, 
  Filter,
  SortAsc,
  MapPin,
  Clock,
  Star,
  Target,
  Sparkles,
  Search
} from "lucide-react";
import CreatePost from "./CreatePost";
import FeedPostCard from "./FeedPostCard";
import SmartRecommendations from "./SmartRecommendations";
import FeedFilters from "./social-feed/FeedFilters";
import FeedHeader from "./social-feed/FeedHeader";
import FeedContent from "./social-feed/FeedContent";
import { useSocialFeed } from "@/hooks/useSocialFeed";
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

  // Smart filtering based on user behavior and preferences
  const getSmartFilteredPosts = () => {
    let posts = filteredPosts;
    
    switch (activeTab) {
      case "for-you":
        // AI-curated feed based on user interests and engagement
        return posts.sort((a, b) => {
          const aScore = (a.likes * 0.3) + (a.responses * 0.5) + (a.shares * 0.2);
          const bScore = (b.likes * 0.3) + (b.responses * 0.5) + (b.shares * 0.2);
          return bScore - aScore;
        });
      
      case "urgent":
        return posts.filter(p => p.urgency === "high" || p.urgency === "urgent");
      
      case "nearby":
        // Filter by location proximity (mock implementation)
        return posts.filter(p => p.location.includes("London") || p.location.includes("Downtown"));
      
      case "trending":
        return posts.sort((a, b) => {
          const now = Date.now();
          const aAge = now - new Date(a.timestamp).getTime();
          const bAge = now - new Date(b.timestamp).getTime();
          const aTrending = (a.likes + a.shares) / (aAge / 3600000); // per hour
          const bTrending = (b.likes + b.shares) / (bAge / 3600000);
          return bTrending - aTrending;
        });
      
      default:
        return posts;
    }
  };

  const smartFilteredPosts = getSmartFilteredPosts();
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

      {/* Smart Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

        {/* Feed Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilter !== "all" && (
                <Badge variant="secondary" className="ml-1">1</Badge>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === "relevance" ? "recent" : "relevance")}
              className="flex items-center space-x-2"
            >
              <SortAsc className="h-4 w-4" />
              <span>{sortBy === "relevance" ? "Most Relevant" : "Most Recent"}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{smartFilteredPosts.length} posts</span>
            </Badge>
            {activeTab === "urgent" && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>{urgentPostsCount} urgent</span>
              </Badge>
            )}
          </div>
        </div>

        {showFilters && (
          <FeedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            postCounts={postCounts}
            onClose={() => setShowFilters(false)}
          />
        )}

        <TabsContent value="for-you" className="space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          
          {/* AI Recommendations */}
          <SmartRecommendations />
          
          <FeedContent
            posts={smartFilteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="Your personalized feed is being prepared! Try connecting with more people or following topics you're interested in."
          />
        </TabsContent>

        <TabsContent value="urgent" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <Zap className="h-5 w-5" />
                <span>Urgent Help Needed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-red-700">
              These requests need immediate attention. Your quick response could make a real difference!
            </CardContent>
          </Card>

          <FeedContent
            posts={smartFilteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="No urgent requests at the moment. Check back soon or explore other tabs!"
          />
        </TabsContent>

        <TabsContent value="nearby" className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <MapPin className="h-5 w-5" />
                <span>Help Nearby</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700">
              Find opportunities to help people in your local area. Building stronger communities starts close to home!
            </CardContent>
          </Card>

          <FeedContent
            posts={smartFilteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="No local requests found. Try expanding your search radius or check other areas!"
          />
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Now</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700">
              See what's getting the most attention in your community right now!
            </CardContent>
          </Card>

          <FeedContent
            posts={smartFilteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="Nothing trending right now. Be the first to start something amazing!"
          />
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <Users className="h-5 w-5" />
                <span>People You Follow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-700">
              Stay updated with posts from people you've connected with and topics you follow.
            </CardContent>
          </Card>

          <FeedContent
            posts={smartFilteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="Follow more people to see their posts here. Build your network in the Connections tab!"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSocialFeed;
