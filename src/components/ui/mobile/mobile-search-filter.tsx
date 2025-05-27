
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  showFilters: boolean;
}

/**
 * Mobile-optimized search and filter bar
 */
export const MobileSearchFilter = ({
  searchValue,
  onSearchChange,
  onFilterToggle,
  showFilters,
}: MobileSearchFilterProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-40 bg-white border-b p-4 md:hidden">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={onFilterToggle}
          className="px-3"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
