
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, WifiOff, Zap, TrendingUp, MapPin, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import CreatePost from "./CreatePost";
import FeedPostCard from "./FeedPostCard";
import { usePosts, usePostInteraction } from "@/services/realPostsService";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates";
import { supabase } from "@/integrations/supabase/client";
import { transformPostToFeedPost } from "@/utils/dataTransformers";

const EnhancedSocialFeed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  
  const { data: posts = [], isLoading, refetch } = usePosts();
  const postInteraction = usePostInteraction();
  
  // Enable real-time updates
  useRealTimeUpdates();
  
  // Enable optimistic updates for better UX
  const { optimisticLike, optimisticComment, revertOptimisticUpdate } = useOptimisticUpdates();

  // Apply tab-specific filtering
  const getFilteredPosts = () => {
    let filteredPosts = posts;

    switch (activeTab) {
      case "urgent":
        return filteredPosts.filter(post => post.urgency === "urgent" || post.urgency === "high");
      case "nearby":
        return filteredPosts.filter(post => post.location && post.location !== 'Location not specified');
      case "trending":
        return filteredPosts.sort((a, b) => {
          const aScore = a.likes_count + a.comments_count + a.shares_count;
          const bScore = b.likes_count + b.comments_count + b.shares_count;
          return bScore - aScore;
        });
      case "following":
        return filteredPosts; // For now, show all posts
      default:
        return filteredPosts;
    }
  };

  const handlePostCreated = () => {
    console.log('Post created, refreshing feed');
    refetch(); // Refresh the posts when a new one is created
  };

  const handleLike = async (postId: string) => {
    try {
      // Get current state for optimistic update
      const post = posts.find(p => p.id === postId);
      const currentlyLiked = post?.is_liked || false;
      
      // Apply optimistic update immediately
      optimisticLike(postId, !currentlyLiked);
      
      // Perform actual API call
      await postInteraction.mutateAsync({
        postId,
        interactionType: 'like'
      });
      
      console.log('Like interaction completed');
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      revertOptimisticUpdate();
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      // Get current user profile for optimistic update
      const { data: user } = await supabase.auth.getUser();
      let userProfile = null;
      
      if (user.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.user.id)
          .single();
        userProfile = profile;
      }
      
      // Apply optimistic update
      optimisticComment(postId, content, userProfile);
      
      // Perform actual API call
      await postInteraction.mutateAsync({
        postId,
        interactionType: 'comment',
        content
      });
      
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Error commenting on post:', error);
      // Revert optimistic update on error
      revertOptimisticUpdate();
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
          <Badge variant="default" className="flex items-center space-x-1 bg-green-100 text-green-800">
            <Wifi className="h-3 w-3" />
            <span>Live Feed</span>
          </Badge>
          <span className="text-sm text-gray-500">
            {posts.length} posts • Updates in real-time
          </span>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Enhanced Feed Tabs with SouLVE Branding */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1 rounded-lg">
          <TabsTrigger 
            value="for-you" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger 
            value="urgent" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Urgent</span>
          </TabsTrigger>
          <TabsTrigger 
            value="nearby" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Nearby</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
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
                  <p className="text-sm text-gray-400 mt-2">Be the first to share something!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPostsForDisplay.map((post) => (
                    <FeedPostCard
                      key={post.id}
                      post={transformPostToFeedPost(post)}
                      onLike={handleLike}
                      onShare={() => {}}
                      onRespond={() => {}}
                      onBookmark={() => {}}
                      onReaction={() => {}}
                      onAddComment={handleComment}
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
