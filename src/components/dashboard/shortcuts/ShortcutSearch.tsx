
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortcutSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ShortcutSearch: React.FC<ShortcutSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search shortcuts by name or key..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 h-9"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSearchChange("")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ShortcutSearch;
