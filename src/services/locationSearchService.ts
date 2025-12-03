// OpenStreetMap Nominatim geocoding service (FREE, no API key required)

export interface LocationSearchResult {
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
  importance: number;
}

export interface ReverseGeocodeResult {
  displayName: string;
  city?: string;
  country?: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Search for locations by name/address (geocoding)
export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SouLVE-App/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Nominatim search failed:', response.status);
      return [];
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
      importance: item.importance,
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};

// Convert coordinates to human-readable address (reverse geocoding)
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SouLVE-App/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    return {
      displayName: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Format location for display (shorter version)
export const formatLocationShort = (displayName: string): string => {
  const parts = displayName.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[parts.length - 1]}`;
  }
  return displayName;
};
