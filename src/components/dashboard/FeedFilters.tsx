
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
    { id: "all", label: "All Posts", icon: "📋", count: postCounts.all },
    { id: "help-needed", label: "Help Needed", icon: "🙋‍♂️", count: postCounts["help-needed"] },
    { id: "help-offered", label: "Help Offered", icon: "🤝", count: postCounts["help-offered"] },
    { id: "success-story", label: "Success Stories", icon: "🎉", count: postCounts["success-story"] },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="flex items-center space-x-2"
        >
          <span>{filter.icon}</span>
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
