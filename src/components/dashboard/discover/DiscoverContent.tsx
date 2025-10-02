
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, FileText, Target, MapPin, Clock, Tag } from "lucide-react";
import { useContentSearch } from "@/hooks/useContentSearch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import EnhancedLoadingState from "@/components/ui/EnhancedLoadingState";

const DiscoverContent = () => {
  const [localQuery, setLocalQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    searchResults,
    isLoading,
    filters,
    updateFilters,
    clearFilters,
    handleSearch,
    filterOptions
  } = useContentSearch();

  const handleSearchSubmit = () => {
    handleSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tags: newTags });
  };

  const activeFiltersCount = (filters.tags?.length || 0) + 
                           (filters.category ? 1 : 0) +
                           (filters.location ? 1 : 0) +
                           (filters.urgency ? 1 : 0) +
                           (filters.dateRange && filters.dateRange !== 'all' ? 1 : 0) +
                           (filters.contentType && filters.contentType !== 'all' ? 1 : 0) +
                           (filters.sortBy && filters.sortBy !== 'relevance' ? 1 : 0);

  const getContentIcon = (type: string) => {
    return type === 'post' ? FileText : Target;
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search posts and campaigns..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearchSubmit} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Advanced Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Content Type */}
                <div>
                  <Label className="text-sm font-medium">Content Type</Label>
                  <Select value={filters.contentType || 'all'} onValueChange={(value) => updateFilters({ contentType: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="posts">Posts Only</SelectItem>
                      <SelectItem value="campaigns">Campaigns Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <Input
                    placeholder="Filter by location..."
                    value={filters.location || ''}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="mt-1"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={filters.category || ''} onValueChange={(value) => updateFilters({ category: value || undefined })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="help_needed">Help Needed</SelectItem>
                      <SelectItem value="help_offered">Help Offered</SelectItem>
                      <SelectItem value="announcement">Announcements</SelectItem>
                      <SelectItem value="question">Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency Filter */}
                <div>
                  <Label className="text-sm font-medium">Urgency</Label>
                  <Select value={filters.urgency || ''} onValueChange={(value) => updateFilters({ urgency: value || undefined })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Urgency</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="text-sm font-medium">Date Range</Label>
                  <Select value={filters.dateRange || 'all'} onValueChange={(value) => updateFilters({ dateRange: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="urgent">Most Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Filter */}
                {filterOptions.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
                      {filterOptions.tags.slice(0, 10).map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags?.includes(tag) || false}
                            onCheckedChange={() => toggleTag(tag)}
                          />
                          <Label htmlFor={`tag-${tag}`} className="text-sm">
                            #{tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.contentType && filters.contentType !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {filters.contentType}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ contentType: 'all' })}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {filters.location}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ location: undefined })}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ category: undefined })}
                />
              </Badge>
            )}
            {filters.urgency && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Urgency: {filters.urgency}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ urgency: undefined })}
                />
              </Badge>
            )}
            {filters.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {isLoading && (
            <EnhancedLoadingState message="Searching content..." />
          )}

          {!isLoading && searchResults.length === 0 && filters.query && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No content found matching your search criteria.</p>
            </div>
          )}

          {!isLoading && !filters.query && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search for posts and campaigns.</p>
            </div>
          )}

          {searchResults.map((item) => {
            const ContentIcon = getContentIcon(item.type);
            
            return (
              <div key={`${item.type}-${item.id}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <ContentIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        {item.urgency && (
                          <Badge className={`text-xs ${getUrgencyColor(item.urgency)}`}>
                            {item.urgency}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    {item.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.content || item.description}
                    </p>
                    
                    {item.type === 'campaign' && item.goal_amount && (
                      <div className="bg-gray-100 rounded-lg p-3 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Raised: £{item.current_amount || 0}</span>
                          <span>Goal: £{item.goal_amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((item.current_amount || 0) / item.goal_amount) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {item.type === 'post' && (
                          <Button size="sm">
                            Offer Help
                          </Button>
                        )}
                        {item.type === 'campaign' && (
                          <Button size="sm">
                            Support
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoverContent;
