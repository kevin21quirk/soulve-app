
import { useState, useEffect } from "react";
import { Search, Clock, TrendingUp, User, MapPin, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'user' | 'location' | 'hashtag' | 'topic';
  icon: React.ComponentType<{ className?: string }>;
  metadata?: string;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  recentSearches: string[];
  onSelectRecent: (search: string) => void;
  onClearRecent: () => void;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'moving help', type: 'topic', icon: Search, metadata: '2.3k posts' },
  { id: '2', text: 'Sarah Johnson', type: 'user', icon: User, metadata: 'Verified Helper' },
  { id: '3', text: 'London, UK', type: 'location', icon: MapPin, metadata: '892 helpers' },
  { id: '4', text: '#tutoring', type: 'hashtag', icon: Hash, metadata: 'Trending' },
  { id: '5', text: 'pet care', type: 'topic', icon: Search, metadata: '1.8k posts' },
  { id: '6', text: 'Mike Wilson', type: 'user', icon: User, metadata: 'Community Champion' },
];

const SearchSuggestions = ({ 
  query, 
  onSelect, 
  recentSearches, 
  onSelectRecent, 
  onClearRecent 
}: SearchSuggestionsProps) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    if (query) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [query]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'location': return MapPin;
      case 'hashtag': return Hash;
      default: return Search;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600';
      case 'location': return 'text-green-600';
      case 'hashtag': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
      {!query && recentSearches.length > 0 && (
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Recent Searches
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearRecent}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-1">
            {recentSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => onSelectRecent(search)}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-600 flex items-center"
              >
                <Clock className="h-3 w-3 mr-2 text-gray-400" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Search className="h-4 w-4 mr-1" />
            Search suggestions
          </h3>
          <div className="space-y-1">
            {filteredSuggestions.map((suggestion) => {
              const IconComponent = getSuggestionIcon(suggestion.type);
              return (
                <button
                  key={suggestion.id}
                  onClick={() => onSelect(suggestion.text)}
                  className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded flex items-center justify-between group"
                >
                  <div className="flex items-center">
                    <IconComponent className={`h-4 w-4 mr-3 ${getSuggestionColor(suggestion.type)}`} />
                    <div>
                      <span className="text-sm text-gray-900">{suggestion.text}</span>
                      {suggestion.metadata && (
                        <div className="text-xs text-gray-500">{suggestion.metadata}</div>
                      )}
                    </div>
                  </div>
                  <TrendingUp className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
            
            {filteredSuggestions.length === 0 && (
              <div className="text-sm text-gray-500 py-2">No suggestions found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
