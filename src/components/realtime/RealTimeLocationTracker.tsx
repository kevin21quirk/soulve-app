
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { MapPin, Navigation, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RealTimeLocationTracker = () => {
  const {
    currentLocation,
    nearbyRequests,
    locationError,
    isTracking,
    startLocationTracking,
    stopLocationTracking,
    refreshNearbyRequests
  } = useLocationTracking();

  const [expanded, setExpanded] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Help Requests
          {currentLocation && (
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              Location Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Location Controls */}
          <div className="flex items-center gap-2">
            {!currentLocation ? (
              <Button 
                onClick={startLocationTracking}
                disabled={isTracking}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                {isTracking ? 'Getting Location...' : 'Enable Location'}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={refreshNearbyRequests}
                  size="sm"
                >
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={stopLocationTracking}
                  size="sm"
                >
                  Stop Tracking
                </Button>
              </div>
            )}
          </div>

          {/* Location Error */}
          {locationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{locationError}</span>
            </div>
          )}

          {/* Current Location Info */}
          {currentLocation && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <MapPin className="h-4 w-4" />
                <span>
                  Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Accuracy: ±{currentLocation.accuracy.toFixed(0)}m
              </div>
            </div>
          )}

          {/* Nearby Requests */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Nearby Requests ({nearbyRequests.length})</h4>
              {nearbyRequests.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show Less' : 'Show All'}
                </Button>
              )}
            </div>

            {nearbyRequests.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{currentLocation ? 'No help requests nearby' : 'Enable location to see nearby requests'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(expanded ? nearbyRequests : nearbyRequests.slice(0, 3)).map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm truncate pr-2">{request.title}</h5>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{request.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{request.distance.toFixed(1)}km away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      by {request.author_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeLocationTracker;
