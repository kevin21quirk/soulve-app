
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X, MapPin } from "lucide-react";
import { DatabaseProfile } from "@/services/realConnectionsService";

interface DatabaseNetworkSearchProps {
  connectedPeople: Array<{
    id: string;
    partner_id: string;
    partner_profile: DatabaseProfile | null;
  }>;
  suggestedConnections: DatabaseProfile[];
  onClose: () => void;
}

const DatabaseNetworkSearch = ({ connectedPeople, suggestedConnections, onClose }: DatabaseNetworkSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Convert to searchable format
  const allPeople = [
    ...connectedPeople.map(conn => ({
      id: conn.partner_id,
      profile: conn.partner_profile,
      type: 'connected' as const
    })),
    ...suggestedConnections.map(profile => ({
      id: profile.id,
      profile,
      type: 'suggested' as const
    }))
  ];
  
  const filteredPeople = allPeople.filter(person => {
    if (!person.profile) return false;
    
    const displayName = `${person.profile.first_name || ''} ${person.profile.last_name || ''}`.trim();
    const matchesQuery = displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (person.profile.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (person.profile.skills || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === "connections") {
      return matchesQuery && person.type === 'connected';
    }
    if (selectedFilter === "suggested") {
      return matchesQuery && person.type === 'suggested';
    }
    return matchesQuery;
  });

  const filters = [
    { id: "all", label: "All People", count: allPeople.length },
    { id: "connections", label: "My Connections", count: connectedPeople.length },
    { id: "suggested", label: "Suggested", count: suggestedConnections.length }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Search Your Network</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, location, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="flex items-center space-x-1"
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="text-xs ml-1">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPeople.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No people found matching your search.</p>
            </div>
          ) : (
            filteredPeople.map((person) => {
              const profile = person.profile!;
              const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
              
              return (
                <div key={person.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || ''} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{displayName}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{profile.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile.skills || []).slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge 
                    variant={person.type === 'connected' ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {person.type === 'connected' ? "Connected" : "Suggested"}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseNetworkSearch;
