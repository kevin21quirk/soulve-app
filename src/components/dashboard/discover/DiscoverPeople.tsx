
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Star, Search, Filter, X } from "lucide-react";
import { useAdvancedUserSearch } from "@/hooks/useAdvancedUserSearch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface DiscoverPeopleProps {
  searchQuery?: string;
}

const DiscoverPeople = ({ searchQuery = "" }: DiscoverPeopleProps) => {
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    searchResults,
    isLoading,
    filters,
    updateFilters,
    clearFilters,
    handleSearch,
    filterOptions
  } = useAdvancedUserSearch();

  const handleSearchSubmit = () => {
    handleSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    updateFilters({ skills: newSkills });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = filters.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateFilters({ interests: newInterests });
  };

  const activeFiltersCount = (filters.skills?.length || 0) + 
                           (filters.interests?.length || 0) + 
                           (filters.location ? 1 : 0) +
                           (filters.sortBy && filters.sortBy !== 'relevance' ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Discover People
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search people by name, skills, or bio..."
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
                      <SelectItem value="trust_score">Trust Score</SelectItem>
                    </SelectContent>
                  </Select>
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
                            onCheckedChange={() => toggleSkill(skill)}
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
                            onCheckedChange={() => toggleInterest(interest)}
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
                  onClick={() => updateFilters({ location: undefined })}
                />
              </Badge>
            )}
            {filters.skills?.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                Skill: {skill}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleSkill(skill)}
                />
              </Badge>
            ))}
            {filters.interests?.map((interest) => (
              <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                Interest: {interest}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleInterest(interest)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-3">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching people...</p>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && filters.query && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No people found matching your search criteria.</p>
            </div>
          )}

          {!isLoading && !filters.query && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search for people by name, skills, or interests.</p>
            </div>
          )}

          {searchResults.map((person) => {
            const displayName = `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Anonymous User';
            
            return (
              <div key={person.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => navigate(`/profile/${person.id}`)}
                  >
                    <AvatarImage src={person.avatar_url || ''} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="font-semibold text-gray-900 cursor-pointer hover:text-primary hover:underline transition-colors"
                        onClick={() => navigate(`/profile/${person.id}`)}
                      >
                        {displayName}
                      </h3>
                      {person.trust_score && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{person.trust_score}%</span>
                        </div>
                      )}
                    </div>
                    
                    {person.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{person.location}</span>
                      </div>
                    )}
                    
                    {person.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{person.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {person.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {person.skills && person.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/profile/${person.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button size="sm">
                          Connect
                        </Button>
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

export default DiscoverPeople;
