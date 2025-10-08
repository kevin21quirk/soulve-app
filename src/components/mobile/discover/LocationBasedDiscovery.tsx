
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Navigation, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { findNearbyUsers, formatDistance, NearbyUser } from "@/services/geolocationService";
import { useToast } from "@/hooks/use-toast";

interface LocationBasedDiscoveryProps {
  onConnect: (personId: string) => void;
}

const LocationBasedDiscovery = ({ onConnect }: LocationBasedDiscoveryProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { latitude, longitude, loading: locationLoading, requestLocation, updateUserLocation } = useGeolocation();
  const [nearbyPeople, setNearbyPeople] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNearbyUsers = async () => {
    if (!latitude || !longitude) {
      const granted = await requestLocation();
      if (!granted) return;
    }

    if (latitude && longitude) {
      setLoading(true);
      const users = await findNearbyUsers(latitude, longitude, 50, 10);
      setNearbyPeople(users);
      setLoading(false);
      
      // Update user's location in the database
      await updateUserLocation(true);
    }
  };

  useEffect(() => {
    loadNearbyUsers();
  }, []);

  const handleRefresh = () => {
    loadNearbyUsers();
    toast({
      title: "Refreshing",
      description: "Searching for nearby users...",
    });
  };

  if (locationLoading || loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Navigation className="h-5 w-5 text-blue-500" />
            <span>Nearby Connections</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Finding nearby users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-blue-500" />
            <span className="text-lg">Nearby Connections</span>
            <Badge variant="secondary" className="text-xs">Live</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <Navigation className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyPeople.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">No nearby users found</p>
            <p className="text-xs text-muted-foreground">
              Try expanding your search radius or check back later
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        ) : (
          nearbyPeople.map((person) => {
            const fullName = `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Anonymous';
            const skills = person.skills || [];
            
            return (
              <div key={person.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar 
                    className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => navigate(`/profile/${person.id}`)}
                  >
                    <AvatarImage src={person.avatar_url || "/placeholder.svg"} alt={fullName} />
                    <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 
                      className="font-medium text-sm cursor-pointer hover:text-primary hover:underline transition-colors"
                      onClick={() => navigate(`/profile/${person.id}`)}
                    >
                      {fullName}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{formatDistance(person.distance_km)} {person.location && `• ${person.location}`}</span>
                    </div>
                  </div>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="gradient"
                  className="w-full"
                  onClick={() => onConnect(person.id)}
                >
                  Connect Nearby
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default LocationBasedDiscovery;
