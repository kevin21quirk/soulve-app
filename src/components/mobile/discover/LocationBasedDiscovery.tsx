
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Navigation, Users, Clock } from "lucide-react";

interface NearbyPerson {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  location: string;
  skills: string[];
  lastActive: string;
  trustScore: number;
}

interface LocationBasedDiscoveryProps {
  onConnect: (personId: string) => void;
}

const LocationBasedDiscovery = ({ onConnect }: LocationBasedDiscoveryProps) => {
  const [nearbyPeople] = useState<NearbyPerson[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      distance: "0.3 miles",
      location: "Downtown Coffee Shop",
      skills: ["Web Development", "UI/UX"],
      lastActive: "2 min ago",
      trustScore: 95
    },
    {
      id: "2", 
      name: "Marcus Johnson",
      avatar: "/placeholder.svg",
      distance: "0.7 miles",
      location: "Community Center",
      skills: ["Photography", "Event Planning"],
      lastActive: "15 min ago",
      trustScore: 88
    }
  ]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Navigation className="h-5 w-5 text-blue-500" />
          <span>Nearby Connections</span>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyPeople.map((person) => (
          <div key={person.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{person.name}</h4>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{person.distance} • {person.location}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {person.trustScore}%
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{person.lastActive}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {person.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <Button
              size="sm"
              variant="gradient"
              className="w-full"
              onClick={() => onConnect(person.id)}
            >
              Connect Nearby
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LocationBasedDiscovery;
