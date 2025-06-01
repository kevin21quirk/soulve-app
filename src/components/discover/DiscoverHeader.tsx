
import { Search, Filter, MapPin, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiscoverHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  location?: string;
}

const DiscoverHeader = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  location
}: DiscoverHeaderProps) => {
  const quickFilters = [
    { id: 'urgent', label: 'Urgent', icon: Zap },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'trending', label: 'Trending', icon: Filter },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-gray-600">Find opportunities to help, connect, and make an impact</p>
        {location && (
          <Badge variant="outline" className="flex items-center space-x-1 w-fit mx-auto">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for help requests, people, or opportunities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {quickFilters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterToggle(filter.id)}
                className="flex items-center space-x-1"
              >
                <filter.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
