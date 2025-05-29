
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeedFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  postCounts: {
    all: number;
    "help-needed": number;
    "help-offered": number;
    "success-story": number;
  };
}

const FeedFilters = ({ activeFilter, onFilterChange, postCounts }: FeedFiltersProps) => {
  const filters = [
    { key: "all", label: "All Posts", count: postCounts.all },
    { key: "help-needed", label: "Help Needed", count: postCounts["help-needed"] },
    { key: "help-offered", label: "Help Offered", count: postCounts["help-offered"] },
    { key: "success-story", label: "Success Stories", count: postCounts["success-story"] }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "default" : "outline"}
          onClick={() => onFilterChange(filter.key)}
          className={`flex items-center space-x-2 transition-all ${
            activeFilter === filter.key 
              ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af] hover:to-[#18a5fe]" 
              : "hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white"
          }`}
        >
          <span>{filter.label}</span>
          <Badge variant="secondary" className="ml-1">
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default FeedFilters;
