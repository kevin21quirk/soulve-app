
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchFilters {
  location?: string;
  skills?: string[];
  interests?: string[];
}

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  filterOptions: {
    skills: string[];
    interests: string[];
    locations: string[];
  };
  onClearFilters: () => void;
}

const UserSearchBar = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  filterOptions,
  onClearFilters
}: UserSearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    onSearchChange(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const updateSkillFilter = (skill: string, checked: boolean) => {
    const currentSkills = filters.skills || [];
    const newSkills = checked 
      ? [...currentSkills, skill]
      : currentSkills.filter(s => s !== skill);
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const updateInterestFilter = (interest: string, checked: boolean) => {
    const currentInterests = filters.interests || [];
    const newInterests = checked 
      ? [...currentInterests, interest]
      : currentInterests.filter(i => i !== interest);
    onFiltersChange({ ...filters, interests: newInterests });
  };

  const activeFiltersCount = (filters.skills?.length || 0) + 
                           (filters.interests?.length || 0) + 
                           (filters.location ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name, bio, skills..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          Search
        </Button>
        <Popover>
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
                <h4 className="font-medium">Search Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Location Filter */}
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  placeholder="Filter by location..."
                  value={filters.location || ''}
                  onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Skills Filter */}
              {filterOptions.skills.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
                    {filterOptions.skills.slice(0, 10).map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={filters.skills?.includes(skill) || false}
                          onCheckedChange={(checked) => updateSkillFilter(skill, checked as boolean)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests Filter */}
              {filterOptions.interests.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Interests</Label>
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
                    {filterOptions.interests.slice(0, 10).map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={filters.interests?.includes(interest) || false}
                          onCheckedChange={(checked) => updateInterestFilter(interest, checked as boolean)}
                        />
                        <Label htmlFor={`interest-${interest}`} className="text-sm">
                          {interest}
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
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, location: undefined })}
              />
            </Badge>
          )}
          {filters.skills?.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              Skill: {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateSkillFilter(skill, false)}
              />
            </Badge>
          ))}
          {filters.interests?.map((interest) => (
            <Badge key={interest} variant="secondary" className="flex items-center gap-1">
              Interest: {interest}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateInterestFilter(interest, false)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
