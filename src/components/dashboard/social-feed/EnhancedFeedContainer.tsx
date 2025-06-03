import { useState } from "react";
import CreatePost from "../CreatePost";
import FeedFilters from "../FeedFilters";
import FeedPostCard from "../FeedPostCard";
import { usePosts } from "@/services/realPostsService";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

const EnhancedFeedContainer = () => {
  const { data: posts = [], isLoading, error } = usePosts();
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Enable real-time updates
  useRealTimeUpdates();

  const handlePostCreated = () => {
    console.log("New post created");
    // The post creation will automatically update the feed via react-query
  };

  // Filter posts based on active filter
  const filteredPosts = posts.filter(post => {
    if (activeFilter === "all") return true;
    return post.category === activeFilter;
  });

  const handleLike = (postId: string) => {
    console.log("Like post:", postId);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleRespond = (postId: string) => {
    console.log("Respond to post:", postId);
  };

  const handleBookmark = (postId: string) => {
    console.log("Bookmark post:", postId);
  };

  const handleReaction = (postId: string, reactionType: string) => {
    console.log("React to post:", postId, reactionType);
  };

  const handleAddComment = (postId: string, content: string) => {
    console.log("Add comment to post:", postId, content);
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    console.log("Like comment:", postId, commentId);
  };

  const handleCommentReaction = (postId: string, commentId: string, reactionType: string) => {
    console.log("React to comment:", postId, commentId, reactionType);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load posts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <FeedFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        postCounts={{
          all: posts.length,
          "help-needed": posts.filter(p => p.category === "help-needed").length,
          "help-offered": posts.filter(p => p.category === "help-offered").length,
          "success-story": posts.filter(p => p.category === "success-story").length,
        }}
      />

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found. Be the first to share something!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <FeedPostCard 
              key={post.id} 
              post={post}
              onLike={handleLike}
              onShare={handleShare}
              onRespond={handleRespond}
              onBookmark={handleBookmark}
              onReaction={handleReaction}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onCommentReaction={handleCommentReaction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedFeedContainer;
