
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, WifiOff, Zap, TrendingUp, MapPin, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import CreatePost from "./CreatePost";
import FeedPostCard from "./FeedPostCard";
import { usePosts, usePostInteraction } from "@/services/realPostsService";

const EnhancedSocialFeed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [searchFilters, setSearchFilters] = useState<any>(null);
  
  const { data: posts = [], isLoading, refetch } = usePosts();
  const postInteraction = usePostInteraction();

  // Apply tab-specific filtering
  const getFilteredPosts = () => {
    let filteredPosts = posts;

    switch (activeTab) {
      case "urgent":
        return filteredPosts.filter(post => post.urgency === "urgent" || post.urgency === "high");
      case "nearby":
        return filteredPosts.filter(post => post.location);
      case "trending":
        return filteredPosts.sort((a, b) => {
          const aScore = (a.interactions?.like_count || 0) + (a.interactions?.comment_count || 0);
          const bScore = (b.interactions?.like_count || 0) + (b.interactions?.comment_count || 0);
          return bScore - aScore;
        });
      case "following":
        return filteredPosts; // For now, show all posts
      default:
        return filteredPosts;
    }
  };

  const handlePostCreated = () => {
    refetch(); // Refresh the posts when a new one is created
  };

  const handleLike = async (postId: string) => {
    try {
      await postInteraction.mutateAsync({
        postId,
        interactionType: 'like'
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      await postInteraction.mutateAsync({
        postId,
        interactionType: 'comment',
        content
      });
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
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
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="flex items-center space-x-1">
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </Badge>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

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
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              ) : filteredPostsForDisplay.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts available right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPostsForDisplay.map((post) => (
                    <FeedPostCard
                      key={post.id}
                      post={{
                        id: post.id,
                        author: post.author_profile?.first_name && post.author_profile?.last_name 
                          ? `${post.author_profile.first_name} ${post.author_profile.last_name}`
                          : 'Anonymous',
                        avatar: post.author_profile?.avatar_url || '',
                        title: post.title,
                        description: post.content,
                        category: post.category as any,
                        timestamp: new Date(post.created_at).toLocaleDateString(),
                        location: post.location || 'Location not specified',
                        responses: post.interactions?.comment_count || 0,
                        likes: post.interactions?.like_count || 0,
                        isLiked: post.interactions?.user_liked || false,
                        urgency: post.urgency as any,
                        tags: post.tags || [],
                        visibility: post.visibility as any,
                        allowComments: true,
                        allowSharing: true,
                        shares: 0,
                        isShared: false,
                        isBookmarked: false,
                        comments: [],
                        reactions: []
                      }}
                      onLike={() => handleLike(post.id)}
                      onShare={() => {}}
                      onRespond={() => {}}
                      onBookmark={() => {}}
                      onReaction={() => {}}
                      onAddComment={(content) => handleComment(post.id, content)}
                      onLikeComment={() => {}}
                      onCommentReaction={() => {}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSocialFeed;
