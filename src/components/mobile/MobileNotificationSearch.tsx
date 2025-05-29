
import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MobileNotificationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

const MobileNotificationSearch = ({ 
  searchQuery, 
  onSearchChange, 
  onClose 
}: MobileNotificationSearchProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "donations",
    "campaigns",
    "messages"
  ]);
  
  const [suggestions] = useState<string[]>([
    "urgent notifications",
    "donation alerts",
    "campaign updates",
    "message notifications",
    "social activity"
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (query: string) => {
    onSearchChange(query);
    
    // Add to recent searches if not empty and not already there
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-white">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-20 py-3 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="p-1 h-auto"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs px-2 py-1 h-auto text-blue-600"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Search Results/Suggestions */}
      {!searchQuery && (
        <div className="mt-4 space-y-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50 text-xs"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Suggestions</span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Count */}
      {searchQuery && (
        <div className="mt-3 text-xs text-gray-500">
          Searching for "{searchQuery}"...
        </div>
      )}
    </div>
  );
};

export default MobileNotificationSearch;
