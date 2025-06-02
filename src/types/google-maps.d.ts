
// Google Maps API type declarations
declare global {
  interface Window {
    google: typeof google;
  }
  
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
      }
      
      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
      }
      
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }
      
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
      
      class Geocoder {
        geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
      }
      
      interface GeocoderRequest {
        location?: LatLng | LatLngLiteral;
        address?: string;
      }
      
      interface GeocoderResponse {
        results: GeocoderResult[];
      }
      
      interface GeocoderResult {
        formatted_address: string;
        place_id: string;
      }
      
      namespace places {
        class AutocompleteService {
          getPlacePredictions(
            request: AutocompletionRequest,
            callback: (predictions: QueryAutocompletePrediction[] | null, status: PlacesServiceStatus) => void
          ): void;
        }
        
        class PlacesService {
          constructor(attrContainer: HTMLElement | Map);
          getDetails(
            request: PlaceDetailsRequest,
            callback: (place: PlaceResult | null, status: PlacesServiceStatus) => void
          ): void;
        }
        
        interface AutocompletionRequest {
          input: string;
          types?: string[];
        }
        
        interface QueryAutocompletePrediction {
          place_id: string;
          description: string;
          structured_formatting: {
            main_text: string;
            secondary_text: string;
          };
        }
        
        interface PlaceDetailsRequest {
          placeId: string;
          fields: string[];
        }
        
        interface PlaceResult {
          formatted_address?: string;
          geometry?: {
            location?: LatLng;
          };
        }
        
        enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          NOT_FOUND = 'NOT_FOUND',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          INVALID_REQUEST = 'INVALID_REQUEST',
          UNKNOWN_ERROR = 'UNKNOWN_ERROR'
        }
      }
    }
  }
}

export {};
