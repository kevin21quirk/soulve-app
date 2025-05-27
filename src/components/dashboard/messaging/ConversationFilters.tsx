
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { ConversationFilters } from "@/types/messaging";

interface ConversationFiltersProps {
  filters: ConversationFilters;
  onFiltersChange: (filters: ConversationFilters) => void;
  totalCount: number;
  unreadCount: number;
}

const ConversationFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  unreadCount 
}: ConversationFiltersProps) => {
  const filterOptions = [
    { key: "all", label: "All", count: totalCount },
    { key: "direct", label: "Direct", count: 0 },
    { key: "group", label: "Groups", count: 0 },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "archived", label: "Archived", count: 0 },
  ];

  return (
    <div className="space-y-3 p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search conversations..."
          value={filters.searchQuery || ""}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.key}
            variant={filters.type === option.key ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltersChange({ ...filters, type: option.key as ConversationFilters["type"] })}
            className="flex items-center space-x-1"
          >
            <span>{option.label}</span>
            {option.count > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {option.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ConversationFiltersComponent;
