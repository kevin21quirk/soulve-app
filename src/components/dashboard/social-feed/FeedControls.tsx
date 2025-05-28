
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SortAsc, Target, Zap } from "lucide-react";

interface FeedControlsProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeFilter: string;
  postsCount: number;
  urgentPostsCount: number;
  activeTab: string;
}

const FeedControls = ({
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  activeFilter,
  postsCount,
  urgentPostsCount,
  activeTab
}: FeedControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300"
        >
          <Filter className="h-4 w-4 text-teal-600" />
          <span>Filters</span>
          {activeFilter !== "all" && (
            <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white">1</Badge>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortBy(sortBy === "relevance" ? "recent" : "relevance")}
          className="flex items-center space-x-2 border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300"
        >
          <SortAsc className="h-4 w-4 text-teal-600" />
          <span>{sortBy === "relevance" ? "Most Relevant" : "Most Recent"}</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Badge variant="outline" className="flex items-center space-x-1 border-teal-200 text-teal-700">
          <Target className="h-3 w-3 text-teal-600" />
          <span>{postsCount} posts</span>
        </Badge>
        {activeTab === "urgent" && (
          <Badge variant="destructive" className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500">
            <Zap className="h-3 w-3" />
            <span>{urgentPostsCount} urgent</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FeedControls;
