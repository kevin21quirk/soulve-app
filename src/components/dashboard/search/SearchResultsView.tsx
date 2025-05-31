
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedPost } from "@/types/feed";
import { 
  Calendar, 
  MapPin, 
  User, 
  TrendingUp, 
  Filter,
  SortAsc,
  Grid,
  List
} from "lucide-react";

interface SearchResultsViewProps {
  results: {
    posts: FeedPost[];
    totalCount: number;
    facets: {
      categories: { [key: string]: number };
      locations: { [key: string]: number };
      urgency: { [key: string]: number };
    };
  };
  query: string;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onFilterUpdate: (key: string, value: any) => void;
  onPostClick: (post: FeedPost) => void;
}

const SearchResultsView = ({ 
  results, 
  query, 
  sortBy, 
  setSortBy, 
  onFilterUpdate, 
  onPostClick 
}: SearchResultsViewProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFacets, setShowFacets] = useState(true);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'help-needed': return 'destructive';
      case 'help-offered': return 'default';
      case 'success-story': return 'secondary';
      default: return 'outline';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {query ? `Search results for "${query}"` : 'Discover'}
          </h2>
          <p className="text-gray-600">
            Found {results.totalCount} result{results.totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="engagement">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Toggle Facets */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFacets(!showFacets)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Facets Sidebar */}
        {showFacets && (
          <div className="lg:col-span-1 space-y-4">
            {/* Category Facets */}
            {Object.keys(results.facets.categories).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(results.facets.categories).map(([category, count]) => (
                    <button
                      key={category}
                      onClick={() => onFilterUpdate('categories', [category])}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm"
                    >
                      <span className="capitalize">{category.replace('-', ' ')}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Location Facets */}
            {Object.keys(results.facets.locations).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(results.facets.locations).slice(0, 5).map(([location, count]) => (
                    <button
                      key={location}
                      onClick={() => onFilterUpdate('location', location)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm"
                    >
                      <span>{location}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Urgency Facets */}
            {Object.keys(results.facets.urgency).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Urgency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(results.facets.urgency).map(([urgency, count]) => (
                    <button
                      key={urgency}
                      onClick={() => onFilterUpdate('urgency', [urgency])}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm"
                    >
                      <span className="capitalize">{urgency}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Results */}
        <div className={showFacets ? "lg:col-span-3" : "lg:col-span-4"}>
          {results.posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
              {results.posts.map((post) => (
                <Card 
                  key={post.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onPostClick(post)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getCategoryBadgeColor(post.category)}>
                            {post.category.replace('-', ' ')}
                          </Badge>
                          {post.urgency && post.urgency !== 'medium' && (
                            <Badge className={`text-xs ${getUrgencyColor(post.urgency)}`}>
                              {post.urgency}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-3 line-clamp-3">
                      {post.description}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Engagement */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.responses} responses</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsView;
