import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Navigation, X, ChevronDown } from 'lucide-react';
import { useUserLocation, RADIUS_OPTIONS } from '@/hooks/useNearbyPosts';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  isActive: boolean;
  onLocationChange: (location: { latitude: number; longitude: number } | null, radius: number) => void;
  selectedRadius: number;
}

export const LocationFilter = ({ isActive, onLocationChange, selectedRadius }: LocationFilterProps) => {
  const { location, loading, error, requestLocation } = useUserLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleEnableLocation = async () => {
    const coords = await requestLocation();
    if (coords) {
      onLocationChange(coords, selectedRadius);
    }
  };

  const handleRadiusChange = (radius: number) => {
    if (location) {
      onLocationChange(location, radius);
    }
  };

  const handleDisable = () => {
    onLocationChange(null, selectedRadius);
    setIsOpen(false);
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
          {isActive ? `Nearby (${selectedRadius} km)` : 'Nearby'}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
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

          {!location && !isActive && (
            <Button
              onClick={handleEnableLocation}
              disabled={loading}
              className="w-full gap-2"
              size="sm"
            >
              <Navigation className="h-4 w-4" />
              {loading ? 'Detecting...' : 'Use My Location'}
            </Button>
          )}

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          {(location || isActive) && (
            <div className="space-y-2">
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
            </div>
          )}

          {isActive && (
            <p className="text-xs text-muted-foreground text-center">
              Showing posts within {selectedRadius} km of you
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationFilter;
