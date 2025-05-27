
import React from "react";
import CreatePost from "../CreatePost";
import { useIsMobile } from "@/components/ui/mobile-optimized";

interface FeedHeaderProps {
  onPostCreated: (post: any) => void;
}

/**
 * Header component for the social feed
 * Contains title, description, and post creation
 */
const FeedHeader: React.FC<FeedHeaderProps> = ({ onPostCreated }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h2>
          <p className="text-gray-600">See what your community needs and how you can help</p>
        </div>
      )}
      
      <CreatePost onPostCreated={onPostCreated} />
    </>
  );
};

export default FeedHeader;
