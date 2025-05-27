
import { useState } from "react";
import { Filter, Calendar, MapPin, Users, Tag, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFilters {
  categories: string[];
  dateRange: string;
  location: string;
  radius: number;
  trustScore: number[];
  postTypes: string[];
  urgency: string[];
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const categories = [
  'Moving Help', 'Tutoring', 'Pet Care', 'Tech Support', 
  'Elderly Care', 'Transportation', 'Home Repair', 'Childcare'
];

const postTypes = ['Help Needed', 'Help Offered', 'Success Story'];
const urgencyLevels = ['Low', 'Medium', 'High', 'Urgent'];
const dateRanges = ['Last 24 hours', 'Last week', 'Last month', 'Last 3 months', 'All time'];

const AdvancedSearchFilters = ({ onFiltersChange, onClose }: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    dateRange: 'All time',
    location: '',
    radius: 10,
    trustScore: [0, 100],
    postTypes: [],
    urgency: []
  });

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      categories: [],
      dateRange: 'All time',
      location: '',
      radius: 10,
      trustScore: [0, 100],
      postTypes: [],
      urgency: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.dateRange !== 'All time') count++;
    if (filters.location) count++;
    if (filters.trustScore[0] > 0 || filters.trustScore[1] < 100) count++;
    if (filters.postTypes.length > 0) count++;
    if (filters.urgency.length > 0) count++;
    return count;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Post Types */}
        <div>
          <h3 className="font-medium text-sm mb-3 flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Post Types
          </h3>
          <div className="space-y-2">
            {postTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.postTypes.includes(type)}
                  onCheckedChange={() => 
                    updateFilters('postTypes', toggleArrayItem(filters.postTypes, type))
                  }
                />
                <label className="text-sm text-gray-700">{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-medium text-sm mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => 
                  updateFilters('categories', toggleArrayItem(filters.categories, category))
                }
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h3 className="font-medium text-sm mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </h3>
          <div className="space-y-2">
            {dateRanges.map(range => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.dateRange === range}
                  onCheckedChange={() => updateFilters('dateRange', range)}
                />
                <label className="text-sm text-gray-700">{range}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="font-medium text-sm mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </h3>
          <input
            type="text"
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => updateFilters('location', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <div className="mt-3">
            <label className="text-sm text-gray-600 mb-2 block">
              Radius: {filters.radius}km
            </label>
            <Slider
              value={[filters.radius]}
              onValueChange={(value) => updateFilters('radius', value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Trust Score */}
        <div>
          <h3 className="font-medium text-sm mb-3 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Trust Score Range
          </h3>
          <div className="mb-2">
            <span className="text-sm text-gray-600">
              {filters.trustScore[0]}% - {filters.trustScore[1]}%
            </span>
          </div>
          <Slider
            value={filters.trustScore}
            onValueChange={(value) => updateFilters('trustScore', value)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Urgency */}
        <div>
          <h3 className="font-medium text-sm mb-3">Urgency Level</h3>
          <div className="flex flex-wrap gap-2">
            {urgencyLevels.map(level => (
              <Badge
                key={level}
                variant={filters.urgency.includes(level) ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => 
                  updateFilters('urgency', toggleArrayItem(filters.urgency, level))
                }
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="flex-1">
            Clear All
          </Button>
          <Button size="sm" onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchFilters;
