
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Users, Heart, Navigation, Zap, Target } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DiscoverHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const DiscoverHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter 
}: DiscoverHeaderProps) => {
  const filters: FilterOption[] = [
    { id: "all", label: "All", icon: TrendingUp },
    { id: "people", label: "People", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "campaigns", label: "Causes", icon: Heart },
    { id: "nearby", label: "Nearby", icon: Navigation },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "trending", label: "Trending", icon: TrendingUp }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search people, groups, causes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-none rounded-full"
        />
        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-1 whitespace-nowrap ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                  : ''
              }`}
            >
              <IconComponent className="h-3 w-3" />
              <span>{filter.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverHeader;
