
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, MapPin, Users, Target, Clock } from "lucide-react";

interface DiscoverSearchBarProps {
  onSearch: (query: string, filters: string[]) => void;
  onClearFilters: () => void;
}

const DiscoverSearchBar = ({ onSearch, onClearFilters }: DiscoverSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "popular", label: "Popular", icon: Users },
    { id: "urgent", label: "Urgent", icon: Clock },
    { id: "campaigns", label: "Campaigns", icon: Target },
  ];

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query, activeFilters);
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
          placeholder="Search people, groups, campaigns..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {activeFilters.map((filterId) => {
            const filter = filterOptions.find(f => f.id === filterId);
            return (
              <Badge 
                key={filterId} 
                variant="secondary" 
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => handleFilterToggle(filterId)}
              >
                {filter && <filter.icon className="h-3 w-3" />}
                <span>{filter?.label}</span>
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterToggle(filter.id)}
                className="flex items-center space-x-2"
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscoverSearchBar;
