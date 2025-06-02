
import { useState, useEffect, useRef } from "react";
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
  placeId?: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: string;
}

// Google Places prediction interface
interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationSelector = ({ onLocationSelect, initialLocation = "" }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation ? { address: initialLocation } : null
  );
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create a hidden div for PlacesService
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv);
      placesService.current = new google.maps.places.PlacesService(map);
    } else {
      // Load Google Maps if not already loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_PLACES_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteService.current = new google.maps.places.AutocompleteService();
        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv);
        placesService.current = new google.maps.places.PlacesService(map);
      };
      document.head.appendChild(script);
    }
  }, []);

  // Search for place predictions
  useEffect(() => {
    if (searchQuery.length > 2 && autocompleteService.current) {
      const request = {
        input: searchQuery,
        types: ['establishment', 'geocode'],
      };

      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get address
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({
              location: { lat: latitude, lng: longitude }
            });
            
            if (response.results[0]) {
              const location: LocationData = {
                address: response.results[0].formatted_address,
                coordinates: { lat: latitude, lng: longitude },
                placeId: response.results[0].place_id
              };
              
              setSelectedLocation(location);
              setSearchQuery(location.address);
              onLocationSelect(location);
              
              toast({
                title: "Location detected",
                description: "Your current location has been detected.",
              });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback to coordinates
            const location: LocationData = {
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              coordinates: { lat: latitude, lng: longitude }
            };
            
            setSelectedLocation(location);
            setSearchQuery(location.address);
            onLocationSelect(location);
          }
          
          setIsDetecting(false);
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

  const selectSuggestion = async (prediction: PlacePrediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['formatted_address', 'geometry']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const location: LocationData = {
          address: place.formatted_address || prediction.description,
          coordinates: place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          } : undefined,
          placeId: prediction.place_id
        };
        
        setSelectedLocation(location);
        setSearchQuery(location.address);
        setSuggestions([]);
        onLocationSelect(location);
      }
    });
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
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-sm text-gray-500">{suggestion.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationSelector;
