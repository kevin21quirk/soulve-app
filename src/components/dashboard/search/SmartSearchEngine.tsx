
import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, Filter, TrendingUp, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SmartSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  className?: string;
}

interface SearchFilters {
  categories: string[];
  location: string;
  urgency: string[];
  dateRange: string;
  tags: string[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'trending' | 'location' | 'user' | 'category' | 'ai';
  confidence: number;
  metadata?: any;
}

const SmartSearchEngine = ({ onSearch, onSuggestionSelect, className = "" }: SmartSearchProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    location: "",
    urgency: [],
    dateRange: "all",
    tags: [],
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "moving help", "tutoring math", "pet sitting", "elderly care"
  ]);

  // AI-powered suggestions
  const aiSuggestions: SearchSuggestion[] = useMemo(() => [
    { id: '1', text: 'Find urgent help requests near me', type: 'ai', confidence: 95 },
    { id: '2', text: 'Connect with verified tutors', type: 'ai', confidence: 90 },
    { id: '3', text: 'Join community cleanup events', type: 'ai', confidence: 85 },
    { id: '4', text: 'Offer tech support skills', type: 'ai', confidence: 80 },
  ], []);

  // Trending searches
  const trendingSuggestions: SearchSuggestion[] = [
    { id: 't1', text: 'moving help', type: 'trending', confidence: 98, metadata: { count: 234 } },
    { id: 't2', text: 'pet care', type: 'trending', confidence: 92, metadata: { count: 189 } },
    { id: 't3', text: 'tutoring', type: 'trending', confidence: 87, metadata: { count: 156 } },
    { id: 't4', text: 'elderly support', type: 'trending', confidence: 83, metadata: { count: 123 } },
  ];

  // Location-based suggestions
  const locationSuggestions: SearchSuggestion[] = [
    { id: 'l1', text: 'London', type: 'location', confidence: 95 },
    { id: 'l2', text: 'Manchester', type: 'location', confidence: 90 },
    { id: 'l3', text: 'Birmingham', type: 'location', confidence: 85 },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery, filters);
    
    // Add to search history
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsFocused(false);
    onSuggestionSelect(suggestion);
    handleSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("", filters);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending': return TrendingUp;
      case 'location': return MapPin;
      case 'user': return User;
      case 'ai': return Sparkles;
      default: return Search;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'trending': return 'text-orange-600';
      case 'location': return 'text-green-600';
      case 'user': return 'text-blue-600';
      case 'ai': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search posts, people, skills, locations..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-12 pr-12 h-12 text-lg border-2 focus:border-blue-500 transition-all"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* AI Suggestions */}
            {!query && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.slice(0, 3).map((suggestion) => {
                    const IconComponent = getSuggestionIcon(suggestion.type);
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 hover:bg-purple-50 rounded flex items-center gap-3 group"
                      >
                        <IconComponent className={`h-4 w-4 ${getSuggestionColor(suggestion.type)}`} />
                        <span className="flex-1">{suggestion.text}</span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.confidence}%
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Trending Now</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {trendingSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-2 hover:bg-orange-50 rounded border border-orange-100"
                    >
                      <div className="font-medium text-sm">{suggestion.text}</div>
                      <div className="text-xs text-gray-500">
                        {suggestion.metadata?.count} searches
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && searchHistory.length > 0 && (
              <div className="p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Recent Searches</div>
                <div className="space-y-1">
                  {searchHistory.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick({ 
                        id: `recent-${index}`, 
                        text: search, 
                        type: 'trending', 
                        confidence: 100 
                      })}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Query Suggestions */}
            {query && (
              <div className="p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Smart Suggestions</div>
                <div className="space-y-1">
                  {[
                    `${query} near me`,
                    `urgent ${query}`,
                    `${query} volunteers`,
                    `${query} help offered`
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick({ 
                        id: `smart-${index}`, 
                        text: suggestion, 
                        type: 'ai', 
                        confidence: 90 
                      })}
                      className="w-full text-left p-2 hover:bg-blue-50 rounded flex items-center gap-2"
                    >
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchEngine;
