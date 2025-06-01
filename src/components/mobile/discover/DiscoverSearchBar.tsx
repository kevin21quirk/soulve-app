
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface DiscoverSearchBarProps {
  onSearch: (query: string, filters: string[]) => void;
  onClearFilters: () => void;
}

const DiscoverSearchBar = ({ onSearch, onClearFilters }: DiscoverSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: "nearby", label: "Nearby", color: "bg-blue-100 text-blue-800" },
    { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
    { id: "popular", label: "Popular", color: "bg-green-100 text-green-800" },
    { id: "new", label: "New", color: "bg-purple-100 text-purple-800" }
  ];

  const handleSearch = () => {
    onSearch(searchQuery, activeFilters);
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setActiveFilters([]);
    onClearFilters();
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search people, groups, causes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-gray-500" />
        {filterOptions.map((filter) => (
          <Badge
            key={filter.id}
            variant={activeFilters.includes(filter.id) ? "default" : "outline"}
            onClick={() => toggleFilter(filter.id)}
            className={`cursor-pointer transition-colors ${
              activeFilters.includes(filter.id) ? filter.color : ""
            }`}
          >
            {filter.label}
          </Badge>
        ))}
        
        {(searchQuery || activeFilters.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default DiscoverSearchBar;
