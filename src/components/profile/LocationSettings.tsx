import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Trash2, Loader2, Info } from 'lucide-react';
import { useProfileLocation } from '@/hooks/useProfileLocation';
import { LocationSearchInput } from '@/components/feed/LocationSearchInput';
import { reverseGeocode, formatLocationShort } from '@/services/locationSearchService';
import { useToast } from '@/hooks/use-toast';

export const LocationSettings = () => {
  const { profileLocation, loading, saving, updateProfileLocation, clearProfileLocation, hasProfileLocation } = useProfileLocation();
  const { toast } = useToast();
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleLocationSelect = async (location: { latitude: number; longitude: number; name: string }) => {
    await updateProfileLocation(location.latitude, location.longitude, location.name, true);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get location name
        const result = await reverseGeocode(latitude, longitude);
        const locationName = result ? formatLocationShort(result.displayName) : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        await updateProfileLocation(latitude, longitude, locationName, true);
        setDetectingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Location Detection Failed',
          description: error.message || 'Could not detect your location. Try searching instead.',
          variant: 'destructive',
        });
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClearLocation = async () => {
    await clearProfileLocation();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Settings
        </CardTitle>
        <CardDescription>
          Set your default location for discovering nearby posts and people
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location Display */}
        {hasProfileLocation && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-xs text-muted-foreground">{profileLocation.locationName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              disabled={saving}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Location Search */}
        <div className="space-y-2">
          <Label>Search for a Location</Label>
          <LocationSearchInput
            onLocationSelect={handleLocationSelect}
            placeholder="Enter city, address, or place name..."
            initialValue=""
          />
          <p className="text-xs text-muted-foreground">
            Search for any location worldwide to set as your default
          </p>
        </div>

        {/* Or Detect Location */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleDetectLocation}
          disabled={detectingLocation || saving}
        >
          {detectingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {detectingLocation ? 'Detecting...' : 'Use Current Location'}
        </Button>

        {/* Info Box */}
        <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-blue-700 dark:text-blue-300 font-medium">Why set a location?</p>
            <p className="text-blue-600 dark:text-blue-400 text-xs">
              Your saved location enables the "Nearby" filter on your feed, helping you discover local
              volunteer opportunities, community initiatives, and posts from people in your area—even
              if you don't grant browser location permission.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSettings;
