import React, { useState } from "react";
import FeedFilters from "../FeedFilters";
import SearchBar from "../SearchBar";
import { MobileSearchFilter } from "@/components/ui/mobile";

interface FeedFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  postCounts: Record<string, number>;
  isMobile: boolean;
}

/**
 * Filters and search component for the social feed
 * Handles both mobile and desktop layouts
 */
const SocialFeedFilters: React.FC<FeedFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  postCounts,
  isMobile,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  if (isMobile) {
    return (
      <>
        <MobileSearchFilter
          searchValue={searchQuery}
          onSearchChange={onSearchChange}
          onFilterToggle={() => setShowMobileFilters(!showMobileFilters)}
          showFilters={showMobileFilters}
        />

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4">
              <FeedFilters 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                postCounts={postCounts}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <FeedFilters 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        postCounts={postCounts}
      />
      
      <SearchBar 
        onSearch={onSearchChange}
        placeholder="Search posts, authors, locations..."
        className="w-full md:w-80"
      />
    </div>
  );
};

export default SocialFeedFilters;
