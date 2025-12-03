import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Navigation, X, ChevronDown, Search, Loader2, Settings } from 'lucide-react';
import { useUserLocation, RADIUS_OPTIONS } from '@/hooks/useNearbyPosts';
import { useProfileLocation } from '@/hooks/useProfileLocation';
import { LocationSearchInput } from './LocationSearchInput';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface LocationFilterProps {
  isActive: boolean;
  onLocationChange: (location: { latitude: number; longitude: number } | null, radius: number) => void;
  selectedRadius: number;
}

export const LocationFilter = ({ isActive, onLocationChange, selectedRadius }: LocationFilterProps) => {
  const { location, loading, error, requestLocation, setLocation } = useUserLocation();
  const { profileLocation, hasProfileLocation, loading: profileLoading } = useProfileLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [locationSource, setLocationSource] = useState<'live' | 'profile' | 'manual' | null>(null);
  const navigate = useNavigate();

  // Auto-use profile location if available and no live location
  useEffect(() => {
    if (!location && hasProfileLocation && profileLocation.latitude && profileLocation.longitude) {
      setLocation({ latitude: profileLocation.latitude, longitude: profileLocation.longitude });
      setLocationSource('profile');
    }
  }, [hasProfileLocation, profileLocation, location, setLocation]);

  const handleEnableLocation = async () => {
    const coords = await requestLocation();
    if (coords) {
      setLocationSource('live');
      onLocationChange(coords, selectedRadius);
    }
  };

  const handleUseProfileLocation = () => {
    if (profileLocation.latitude && profileLocation.longitude) {
      const coords = { latitude: profileLocation.latitude, longitude: profileLocation.longitude };
      setLocation(coords);
      setLocationSource('profile');
      onLocationChange(coords, selectedRadius);
    }
  };

  const handleManualLocation = (loc: { latitude: number; longitude: number; name: string }) => {
    setLocation({ latitude: loc.latitude, longitude: loc.longitude });
    setLocationSource('manual');
    onLocationChange({ latitude: loc.latitude, longitude: loc.longitude }, selectedRadius);
    setShowSearch(false);
  };

  const handleRadiusChange = (radius: number) => {
    if (location) {
      onLocationChange(location, radius);
    }
  };

  const handleDisable = () => {
    onLocationChange(null, selectedRadius);
    setLocationSource(null);
    setIsOpen(false);
  };

  const getLocationLabel = () => {
    if (!isActive) return 'Nearby';
    if (locationSource === 'profile' && profileLocation.locationName) {
      return `${profileLocation.locationName} (${selectedRadius} km)`;
    }
    return `Nearby (${selectedRadius} km)`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-2",
            isActive && "bg-primary text-primary-foreground"
          )}
        >
          <MapPin className="h-4 w-4" />
          <span className="max-w-[120px] truncate">{getLocationLabel()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Location Filter</h4>
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleDisable}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Show search input */}
          {showSearch ? (
            <div className="space-y-2">
              <LocationSearchInput
                onLocationSelect={handleManualLocation}
                placeholder="Search city or address..."
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowSearch(false)}
              >
                Cancel
              </Button>
            </div>
          ) : !location && !isActive ? (
            <div className="space-y-2">
              {/* Use Profile Location (if available) */}
              {hasProfileLocation && profileLocation.locationName && (
                <Button
                  onClick={handleUseProfileLocation}
                  variant="outline"
                  className="w-full gap-2 justify-start"
                  size="sm"
                  disabled={profileLoading}
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{profileLocation.locationName}</span>
                </Button>
              )}

              {/* Detect Live Location */}
              <Button
                onClick={handleEnableLocation}
                disabled={loading}
                className="w-full gap-2"
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {loading ? 'Detecting...' : 'Use Current Location'}
              </Button>

              {/* Search for Location */}
              <Button
                onClick={() => setShowSearch(true)}
                variant="outline"
                className="w-full gap-2"
                size="sm"
              >
                <Search className="h-4 w-4" />
                Search for Location
              </Button>

              {/* Link to Settings */}
              {!hasProfileLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/dashboard?tab=profile');
                  }}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Set default location in profile
                </Button>
              )}
            </div>
          ) : null}

          {error && (
            <div className="space-y-2">
              <p className="text-xs text-destructive">{error}</p>
              <Button
                onClick={() => setShowSearch(true)}
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs"
              >
                <Search className="h-3 w-3" />
                Search instead
              </Button>
            </div>
          )}

          {(location || isActive) && !showSearch && (
            <div className="space-y-2">
              {/* Current location indicator */}
              {locationSource && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {locationSource === 'live' && 'Using live location'}
                    {locationSource === 'profile' && `Using: ${profileLocation.locationName}`}
                    {locationSource === 'manual' && 'Using searched location'}
                  </span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Search radius:</p>
              <div className="grid grid-cols-2 gap-2">
                {RADIUS_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedRadius === option.value ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleRadiusChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Change location option */}
              <Button
                onClick={() => setShowSearch(true)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                <Search className="h-3 w-3 mr-1" />
                Change location
              </Button>
            </div>
          )}

          {isActive && (
            <p className="text-xs text-muted-foreground text-center">
              Showing posts within {selectedRadius} km
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationFilter;
