
import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useEnhancedRecommendations } from "@/hooks/useEnhancedRecommendations";
import SearchSuggestions from "./SearchSuggestions";
import AdvancedSearchFilters from "./AdvancedSearchFilters";
import TrendingTopics from "./TrendingTopics";

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showTrending?: boolean;
}

const EnhancedSearchBar = ({ 
  onSearch, 
  placeholder = "Search posts, people, locations...", 
  className = "",
  showTrending = false
}: EnhancedSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "moving help London", "tutoring math", "pet sitting", "tech support", "elderly care"
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const { recommendations } = useEnhancedRecommendations();

  // Enhanced validation for search
  const { validateSingleField, getError } = useFormValidation({
    search: {
      maxLength: 100,
      custom: (value: string) => {
        if (value && value.trim().length < 2) {
          return "Search must be at least 2 characters";
        }
        return null;
      }
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    const isValid = validateSingleField('search', value);
    if (!isValid) return;

    setQuery(value);
    onSearch(value);
    
    if (value && !recentSearches.includes(value)) {
      setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSearch(suggestion);
    setIsFocused(false);
  };

  const handleRecentSelect = (search: string) => {
    handleSearch(search);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters applied:", filters);
  };

  const searchError = getError('search');

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              validateSingleField('search', e.target.value);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            onFocus={() => setIsFocused(true)}
            className={`pl-10 pr-20 h-11 border-2 focus:border-blue-500 transition-colors ${
              searchError ? 'border-red-300' : ''
            }`}
          />
          {searchError && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">{searchError}</p>
          )}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 w-7 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-7 w-7 p-0 ${showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Enhanced Search Suggestions with AI recommendations */}
        {isFocused && (
          <SearchSuggestions
            query={query}
            onSelect={handleSuggestionSelect}
            recentSearches={recentSearches}
            onSelectRecent={handleRecentSelect}
            onClearRecent={clearRecentSearches}
            recommendations={recommendations.slice(0, 3)}
          />
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="absolute top-full right-0 mt-1 z-50">
            <AdvancedSearchFilters
              onFiltersChange={handleFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}
      </div>

      {/* AI Search Suggestions with enhanced relevance */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-40 mt-1 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recommendations.slice(0, 4).map((rec, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(rec.title)}
                className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded border border-gray-100 flex items-center justify-between"
              >
                <span>{rec.title}</span>
                <span className="text-xs text-blue-500">{rec.relevanceScore}% match</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Topics (when enabled) */}
      {showTrending && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30">
          <TrendingTopics onTopicClick={handleSuggestionSelect} />
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
