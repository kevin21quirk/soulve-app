
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  DollarSign, 
  Users, 
  MessageCircle, 
  Target,
  Filter
} from "lucide-react";

interface MobileNotificationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filterCounts: {
    all: number;
    donation: number;
    campaign: number;
    message: number;
    social: number;
  };
}

const MobileNotificationFilters = ({ 
  activeFilter, 
  onFilterChange, 
  filterCounts 
}: MobileNotificationFiltersProps) => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  const filters = [
    { 
      id: "all", 
      label: "All", 
      icon: Bell, 
      count: filterCounts.all,
      color: "text-gray-600"
    },
    { 
      id: "donation", 
      label: "Donations", 
      icon: DollarSign, 
      count: filterCounts.donation,
      color: "text-green-600"
    },
    { 
      id: "campaign", 
      label: "Campaigns", 
      icon: Target, 
      count: filterCounts.campaign,
      color: "text-blue-600"
    },
    { 
      id: "message", 
      label: "Messages", 
      icon: MessageCircle, 
      count: filterCounts.message,
      color: "text-purple-600"
    },
    { 
      id: "social", 
      label: "Social", 
      icon: Users, 
      count: filterCounts.social,
      color: "text-orange-600"
    },
  ];

  const visibleFilters = showAllFilters ? filters : filters.slice(0, 3);
  const hiddenFiltersCount = filters.length - 3;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filter by type</h3>
        {hiddenFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="text-xs p-1 h-auto"
          >
            <Filter className="h-3 w-3 mr-1" />
            {showAllFilters ? 'Less' : `+${hiddenFiltersCount} more`}
          </Button>
        )}
      </div>

      <ScrollArea className="w-full">
        <div className="flex space-x-2">
          {visibleFilters.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center space-x-2 text-xs whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <IconComponent className={`h-3 w-3 ${isActive ? 'text-white' : filter.color}`} />
                <span>{filter.label}</span>
                {filter.count > 0 && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className={`text-xs ml-1 ${
                      isActive 
                        ? 'bg-white text-blue-500' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {filter.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>Total: {filterCounts.all}</span>
          <span>•</span>
          <span>Unread: {filters.find(f => f.id === activeFilter)?.count || 0}</span>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationFilters;
