
import { useState } from "react";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import MobileCreatePost from "./MobileCreatePost";
import MobilePostCard from "./MobilePostCard";
import MobileStories from "./MobileStories";

const MobileFeed = () => {
  const {
    filteredPosts,
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

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stories Section */}
      <MobileStories />
      
      {/* Create Post */}
      <div className="px-4 py-3">
        <MobileCreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Feed Posts */}
      <div className="space-y-3 px-4 pb-4">
        {filteredPosts.map((post) => (
          <MobilePostCard
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
        ))}
      </div>

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12 px-4">
          <div className="text-gray-400 text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SouLVE</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Start connecting with your community. Share your story, offer help, or discover amazing people nearby.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileFeed;
