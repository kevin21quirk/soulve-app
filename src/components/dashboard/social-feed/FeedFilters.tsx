
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, MapPin, Clock, Heart, Zap } from "lucide-react";

interface FeedFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  postCounts: any;
  onClose: () => void;
}

const FeedFilters = ({ activeFilter, onFilterChange, postCounts, onClose }: FeedFiltersProps) => {
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Filter & Sort</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Filters */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant={activeFilter === "help-needed" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("help-needed")}
              className="justify-start"
            >
              <Heart className="h-4 w-4 mr-2" />
              Help Needed
              <Badge variant="secondary" className="ml-auto">
                {postCounts.helpNeeded}
              </Badge>
            </Button>
            
            <Button
              variant={activeFilter === "help-offered" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("help-offered")}
              className="justify-start"
            >
              <Heart className="h-4 w-4 mr-2" />
              Help Offered
              <Badge variant="secondary" className="ml-auto">
                {postCounts.helpOffered}
              </Badge>
            </Button>
            
            <Button
              variant={activeFilter === "urgent" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("urgent")}
              className="justify-start"
            >
              <Zap className="h-4 w-4 mr-2" />
              Urgent
              <Badge variant="destructive" className="ml-auto">
                {postCounts.urgent}
              </Badge>
            </Button>
            
            <Button
              variant={activeFilter === "success-story" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("success-story")}
              className="justify-start"
            >
              Success Stories
              <Badge variant="secondary" className="ml-auto">
                {postCounts.successStory}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="uptown">Uptown</SelectItem>
              <SelectItem value="suburb">Suburbs</SelectItem>
              <SelectItem value="nearby">Within 5 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Posted
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Distance Slider */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Distance Range (miles)</Label>
          <Slider
            defaultValue={[10]}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 mile</span>
            <span>50+ miles</span>
          </div>
        </div>

        {/* Category Checkboxes */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Transportation",
              "Moving",
              "Childcare",
              "Elder Care",
              "Tutoring",
              "Home Repair",
              "Food & Groceries",
              "Pet Care"
            ].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category} className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onFilterChange("all")}>
            Clear All
          </Button>
          <Button onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedFilters;
