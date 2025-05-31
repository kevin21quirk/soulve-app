
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: string;
}

const LocationSelector = ({ onLocationSelect, initialLocation = "" }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation ? { address: initialLocation } : null
  );

  // Mock location suggestions (in real app, use Google Places or similar)
  const mockSuggestions = [
    "New York, NY, USA",
    "Los Angeles, CA, USA", 
    "Chicago, IL, USA",
    "Houston, TX, USA",
    "Phoenix, AZ, USA",
    "Philadelphia, PA, USA"
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockSuggestions.filter(place => 
        place.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, reverse geocode these coordinates
          const mockAddress = "Current Location (Detected)";
          const location: LocationData = {
            address: mockAddress,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          };
          
          setSelectedLocation(location);
          setSearchQuery(mockAddress);
          onLocationSelect(location);
          setIsDetecting(false);
          
          toast({
            title: "Location detected",
            description: "Your current location has been detected.",
          });
        },
        (error) => {
          setIsDetecting(false);
          toast({
            title: "Location detection failed",
            description: "Unable to detect your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsDetecting(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const location: LocationData = { address: suggestion };
    setSelectedLocation(location);
    setSearchQuery(suggestion);
    setSuggestions([]);
    onLocationSelect(location);
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    onLocationSelect({ address: "" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Enter location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {selectedLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="flex items-center space-x-1"
        >
          <Navigation className={`h-4 w-4 ${isDetecting ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">Detect</span>
        </Button>
      </div>

      {suggestions.length > 0 && (
        <Card className="absolute z-10 w-full">
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationSelector;
