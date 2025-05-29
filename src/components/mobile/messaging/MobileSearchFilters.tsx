
import { Button } from "@/components/ui/button";
import { Search, Users, MessageCircle } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileSearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const MobileSearchFilters = ({ activeFilter, onFilterChange }: MobileSearchFiltersProps) => {
  const filters: FilterOption[] = [
    { id: "all", label: "All", icon: Search },
    { id: "people", label: "People", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "messages", label: "Messages", icon: MessageCircle }
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto px-4 pb-3">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        return (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
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
  );
};

export default MobileSearchFilters;
