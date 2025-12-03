import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchLocations, formatLocationShort, LocationSearchResult } from '@/services/locationSearchService';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface LocationSearchInputProps {
  onLocationSelect: (location: { latitude: number; longitude: number; name: string }) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export const LocationSearchInput = ({
  onLocationSelect,
  placeholder = 'Search for a location...',
  className,
  initialValue = '',
}: LocationSearchInputProps) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search when query changes
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const searchResults = await searchLocations(debouncedQuery);
      setResults(searchResults);
      setShowResults(true);
      setLoading(false);
    };

    search();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: LocationSearchResult) => {
    const shortName = formatLocationShort(result.displayName);
    setQuery(shortName);
    setShowResults(false);
    onLocationSelect({
      latitude: result.latitude,
      longitude: result.longitude,
      name: shortName,
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-9 pr-8"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!loading && query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
          <div className="p-1">
            {results.map((result, index) => (
              <button
                key={`${result.latitude}-${result.longitude}-${index}`}
                onClick={() => handleSelect(result)}
                className="w-full flex items-start gap-2 p-2 text-left hover:bg-muted rounded-md transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {formatLocationShort(result.displayName)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {result.displayName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && query.length >= 2 && !loading && results.length === 0 && (
        <Card className="absolute z-50 w-full mt-1 p-3 shadow-lg">
          <p className="text-sm text-muted-foreground text-center">
            No locations found for "{query}"
          </p>
        </Card>
      )}
    </div>
  );
};

export default LocationSearchInput;
