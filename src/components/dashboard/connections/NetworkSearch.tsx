
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X, Filter, MapPin, Users, Briefcase, GraduationCap } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface NetworkSearchProps {
  connections: ConnectionRequest[];
  suggestedConnections: ConnectionRequest[];
  onClose: () => void;
}

const NetworkSearch = ({ connections, suggestedConnections, onClose }: NetworkSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: [] as string[],
    skills: [] as string[],
    trustScore: [0, 100] as [number, number],
    connectionType: "all" as "connected" | "suggested" | "all"
  });

  const allPeople = [...connections, ...suggestedConnections];
  const allLocations = [...new Set(allPeople.map(p => p.location))];
  const allSkills = [...new Set(allPeople.flatMap(p => p.skills))];

  const filteredPeople = allPeople.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = filters.location.length === 0 || filters.location.includes(person.location);
    const matchesSkills = filters.skills.length === 0 || filters.skills.some(skill => person.skills.includes(skill));
    const matchesTrustScore = person.trustScore >= filters.trustScore[0] && person.trustScore <= filters.trustScore[1];
    
    const matchesType = filters.connectionType === "all" ||
                       (filters.connectionType === "connected" && connections.includes(person)) ||
                       (filters.connectionType === "suggested" && suggestedConnections.includes(person));

    return matchesSearch && matchesLocation && matchesSkills && matchesTrustScore && matchesType;
  });

  const toggleFilter = (filterType: "location" | "skills", value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Your Network</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, bio, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.location.length + filters.skills.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.location.length + filters.skills.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Options</h4>
                
                {/* Connection Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Connection Type</label>
                  <div className="flex space-x-2">
                    {["all", "connected", "suggested"].map(type => (
                      <Button
                        key={type}
                        variant={filters.connectionType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, connectionType: type as any }))}
                      >
                        {type === "all" ? "All" : type === "connected" ? "Connected" : "Suggested"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Trust Score Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Trust Score: {filters.trustScore[0]}% - {filters.trustScore[1]}%
                  </label>
                  <Slider
                    value={filters.trustScore}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, trustScore: value as [number, number] }))}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {allLocations.map(location => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.location.includes(location)}
                          onCheckedChange={() => toggleFilter("location", location)}
                        />
                        <span className="text-sm">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Skills</label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {allSkills.slice(0, 10).map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.skills.includes(skill)}
                          onCheckedChange={() => toggleFilter("skills", skill)}
                        />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ location: [], skills: [], trustScore: [0, 100], connectionType: "all" })}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            {filteredPeople.length} {filteredPeople.length === 1 ? "result" : "results"} found
          </p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPeople.map(person => (
              <div key={person.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{person.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{person.location}</span>
                    <span>•</span>
                    <Users className="h-3 w-3" />
                    <span>{person.mutualConnections} mutual</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.skills.slice(0, 2).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <Badge className="mb-1 text-xs">
                    {person.trustScore}% Trust
                  </Badge>
                  <p className="text-xs text-gray-500">
                    {connections.includes(person) ? "Connected" : "Suggested"}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredPeople.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No people found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkSearch;
