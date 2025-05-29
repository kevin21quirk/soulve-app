
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Clock, Users, X } from "lucide-react";

interface MobileFeedFiltersProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearFilters: () => void;
  postCounts: Record<string, number>;
}

const filterConfig = [
  { id: "urgent", label: "Urgent", icon: Zap, color: "bg-red-500 text-white" },
  { id: "nearby", label: "Nearby", icon: MapPin, color: "bg-blue-500 text-white" },
  { id: "recent", label: "Recent", icon: Clock, color: "bg-green-500 text-white" },
  { id: "trending", label: "Trending", icon: Users, color: "bg-purple-500 text-white" },
];

const MobileFeedFilters = ({ 
  activeFilters, 
  onFilterToggle, 
  onClearFilters, 
  postCounts 
}: MobileFeedFiltersProps) => {
  return (
    <div className="bg-white border-b border-gray-100 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm">Quick Filters</h3>
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs text-gray-500 p-1 h-auto"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {filterConfig.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          const count = postCounts[filter.id] || 0;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterToggle(filter.id)}
              className={`flex items-center space-x-1 flex-shrink-0 relative ${
                isActive ? filter.color : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <filter.icon className="h-3 w-3" />
              <span className="text-xs font-medium">{filter.label}</span>
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`ml-1 text-xs px-1 py-0 h-4 min-w-4 ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFeedFilters;
