
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDown, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import FeedFilters from "./FeedFilters";
import CampaignStatsWidget from "./CampaignStatsWidget";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import FeedContent from "./social-feed/FeedContent";
import CreatePost from "./CreatePost";
import SmartRecommendations from "./SmartRecommendations";
import TestButtons from "./TestButtons";

const EnhancedSocialFeed = () => {
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: undefined,
    sort: "recent",
  });
  const [searchQuery, setSearchQuery] = useState("");

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
    getPostCounts,
  } = useSocialFeed();

  console.log("EnhancedSocialFeed rendered with:", { 
    filteredPosts: filteredPosts?.length, 
    activeFilter, 
    isLoading 
  });

  return (
    <div className="space-y-6">
      {/* Test Buttons Panel */}
      <TestButtons />
      
      {/* Create Post Section */}
      <CreatePost onPostCreated={handlePostCreated} />
      
      {/* Smart Recommendations */}
      <SmartRecommendations />

      {/* Filters and Campaign Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FeedFilters 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            postCounts={getPostCounts()}
          />
        </div>
        <div className="lg:w-80">
          <CampaignStatsWidget />
        </div>
      </div>

      {/* Social Feed Content */}
      <Card>
        <CardHeader>
          <CardTitle>Community Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedContent
            posts={filteredPosts}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
            onRespond={handleRespond}
            onBookmark={handleBookmark}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onCommentReaction={handleCommentReaction}
            emptyMessage="No posts found. Try adjusting your filters or check back later!"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSocialFeed;
