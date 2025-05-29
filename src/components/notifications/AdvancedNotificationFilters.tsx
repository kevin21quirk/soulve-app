
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  Search,
  DollarSign,
  Clock,
  MapPin,
  Tag,
  TrendingUp
} from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface AdvancedFilters {
  dateRange: {
    preset: string;
    from?: Date;
    to?: Date;
  };
  categories: string[];
  priority: string[];
  readStatus: string;
  amountRange: [number, number];
  location: string;
  keywords: string[];
  source: string[];
  engagement: {
    minLikes: number;
    minComments: number;
    minShares: number;
  };
}

interface AdvancedNotificationFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClose?: () => void;
}

const AdvancedNotificationFilters = ({ 
  filters, 
  onFiltersChange, 
  onClose 
}: AdvancedNotificationFiltersProps) => {
  const [keywordInput, setKeywordInput] = useState("");

  const datePresets = [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "custom", label: "Custom range" }
  ];

  const categories = [
    { value: "donations", label: "Donations", color: "bg-green-100 text-green-800" },
    { value: "campaigns", label: "Campaigns", color: "bg-blue-100 text-blue-800" },
    { value: "messages", label: "Messages", color: "bg-purple-100 text-purple-800" },
    { value: "social", label: "Social", color: "bg-orange-100 text-orange-800" },
    { value: "system", label: "System", color: "bg-gray-100 text-gray-800" }
  ];

  const priorities = [
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" }
  ];

  const sources = [
    { value: "web", label: "Web App" },
    { value: "mobile", label: "Mobile App" },
    { value: "email", label: "Email" },
    { value: "api", label: "API" },
    { value: "system", label: "System" }
  ];

  const updateFilters = (updates: Partial<AdvancedFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    updateFilters({ categories: newCategories });
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    updateFilters({ priority: newPriorities });
  };

  const handleSourceToggle = (source: string) => {
    const newSources = filters.source.includes(source)
      ? filters.source.filter(s => s !== source)
      : [...filters.source, source];
    
    updateFilters({ source: newSources });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !filters.keywords.includes(keywordInput.trim())) {
      updateFilters({ 
        keywords: [...filters.keywords, keywordInput.trim()] 
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    updateFilters({ 
      keywords: filters.keywords.filter(k => k !== keyword) 
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { preset: "all" },
      categories: [],
      priority: [],
      readStatus: "all",
      amountRange: [0, 10000],
      location: "",
      keywords: [],
      source: [],
      engagement: {
        minLikes: 0,
        minComments: 0,
        minShares: 0
      }
    });
  };

  const getDateFromPreset = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case "today":
        return { from: new Date(now.setHours(0, 0, 0, 0)), to: new Date() };
      case "week":
        return { from: subWeeks(now, 1), to: new Date() };
      case "month":
        return { from: subMonths(now, 1), to: new Date() };
      case "quarter":
        return { from: subMonths(now, 3), to: new Date() };
      default:
        return {};
    }
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.priority.length + 
    filters.keywords.length + 
    filters.source.length +
    (filters.readStatus !== "all" ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.dateRange.preset !== "all" ? 1 : 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Date Range */}
        <div>
          <Label className="text-sm font-medium">Date Range</Label>
          <div className="mt-2 space-y-2">
            <Select 
              value={filters.dateRange.preset} 
              onValueChange={(value) => {
                const dateRange = value === "custom" 
                  ? { preset: value, from: subDays(new Date(), 7), to: new Date() }
                  : { preset: value, ...getDateFromPreset(value) };
                updateFilters({ dateRange });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map(preset => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filters.dateRange.preset === "custom" && (
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => updateFilters({
                        dateRange: { ...filters.dateRange, from: date }
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => updateFilters({
                        dateRange: { ...filters.dateRange, to: date }
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium">Categories</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => handleCategoryToggle(category.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.categories.includes(category.value)
                    ? category.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <Label className="text-sm font-medium">Priority</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {priorities.map(priority => (
              <button
                key={priority.value}
                onClick={() => handlePriorityToggle(priority.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.priority.includes(priority.value)
                    ? priority.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Read Status */}
        <div>
          <Label className="text-sm font-medium">Read Status</Label>
          <Select 
            value={filters.readStatus} 
            onValueChange={(value) => updateFilters({ readStatus: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="read">Read only</SelectItem>
              <SelectItem value="unread">Unread only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keywords */}
        <div>
          <Label className="text-sm font-medium">Keywords</Label>
          <div className="mt-2 space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Add keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {filters.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="pr-1">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <Label className="text-sm font-medium">
            Amount Range: ${filters.amountRange[0]} - ${filters.amountRange[1]}
          </Label>
          <div className="mt-2">
            <Slider
              value={filters.amountRange}
              onValueChange={(value) => updateFilters({ amountRange: value as [number, number] })}
              max={10000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>
        </div>

        {/* Source */}
        <div>
          <Label className="text-sm font-medium">Source</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {sources.map(source => (
              <div key={source.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.source.includes(source.value)}
                  onCheckedChange={() => handleSourceToggle(source.value)}
                />
                <label className="text-sm">{source.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium">Location</Label>
          <Input
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* Engagement Metrics */}
        <div>
          <Label className="text-sm font-medium">Minimum Engagement</Label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500">Likes</label>
              <Input
                type="number"
                min="0"
                value={filters.engagement.minLikes}
                onChange={(e) => updateFilters({
                  engagement: { 
                    ...filters.engagement, 
                    minLikes: parseInt(e.target.value) || 0 
                  }
                })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Comments</label>
              <Input
                type="number"
                min="0"
                value={filters.engagement.minComments}
                onChange={(e) => updateFilters({
                  engagement: { 
                    ...filters.engagement, 
                    minComments: parseInt(e.target.value) || 0 
                  }
                })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Shares</label>
              <Input
                type="number"
                min="0"
                value={filters.engagement.minShares}
                onChange={(e) => updateFilters({
                  engagement: { 
                    ...filters.engagement, 
                    minShares: parseInt(e.target.value) || 0 
                  }
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedNotificationFilters;
