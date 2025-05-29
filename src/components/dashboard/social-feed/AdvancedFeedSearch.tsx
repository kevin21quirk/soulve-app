
import { useState } from "react";
import { Search, Filter, MapPin, Calendar, User, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFilters {
  query: string;
  categories: string[];
  urgency: string[];
  location: string;
  dateRange: string;
  author: string;
  tags: string[];
}

interface AdvancedFeedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const AdvancedFeedSearch = ({ onSearch, onClear }: AdvancedFeedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    urgency: [],
    location: "",
    dateRange: "all",
    author: "",
    tags: [],
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { id: "help-needed", label: "Help Needed", color: "red" },
    { id: "help-offered", label: "Help Offered", color: "green" },
    { id: "success-story", label: "Success Stories", color: "blue" },
    { id: "announcement", label: "Announcements", color: "purple" },
    { id: "question", label: "Questions", color: "yellow" },
    { id: "recommendation", label: "Recommendations", color: "indigo" },
  ];

  const urgencyLevels = [
    { id: "urgent", label: "Urgent", color: "red" },
    { id: "high", label: "High", color: "orange" },
    { id: "medium", label: "Medium", color: "yellow" },
    { id: "low", label: "Low", color: "green" },
  ];

  const popularTags = ["moving", "tutoring", "pets", "tech", "elderly", "community", "volunteer"];

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleUrgencyToggle = (urgencyId: string) => {
    setFilters(prev => ({
      ...prev,
      urgency: prev.urgency.includes(urgencyId)
        ? prev.urgency.filter(id => id !== urgencyId)
        : [...prev.urgency, urgencyId]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: "",
      categories: [],
      urgency: [],
      location: "",
      dateRange: "all",
      author: "",
      tags: [],
    });
    onClear();
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.urgency.length + 
    filters.tags.length + 
    (filters.location ? 1 : 0) + 
    (filters.dateRange !== "all" ? 1 : 0) + 
    (filters.author ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posts, people, locations..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pl-10 pr-4"
          />
        </div>
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-6" align="end">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <label htmlFor={category.id} className="text-sm cursor-pointer">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Urgency Level</h4>
                <div className="grid grid-cols-2 gap-2">
                  {urgencyLevels.map((urgency) => (
                    <div key={urgency.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={urgency.id}
                        checked={filters.urgency.includes(urgency.id)}
                        onCheckedChange={() => handleUrgencyToggle(urgency.id)}
                      />
                      <label htmlFor={urgency.id} className="text-sm cursor-pointer">
                        {urgency.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </h4>
                <Input
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </h4>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Author
                </h4>
                <Input
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleSearch} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <Badge key={categoryId} variant="secondary" className="cursor-pointer">
                {category?.label}
                <button
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          {filters.urgency.map(urgencyId => {
            const urgency = urgencyLevels.find(u => u.id === urgencyId);
            return (
              <Badge key={urgencyId} variant="secondary" className="cursor-pointer">
                {urgency?.label} urgency
                <button
                  onClick={() => handleUrgencyToggle(urgencyId)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer">
              #{tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.location && (
            <Badge variant="secondary" className="cursor-pointer">
              📍 {filters.location}
              <button
                onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFeedSearch;
