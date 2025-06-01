
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Users, TrendingUp } from 'lucide-react';
import { useRealTimePoints } from '@/hooks/useRealTimePoints';

interface LocationImpact {
  location: string;
  count: number;
  points: number;
  lastActivity: string;
  coordinates?: { lat: number; lng: number };
}

const GeographicImpactMap = () => {
  const { recentTransactions } = useRealTimePoints();
  const [locationData, setLocationData] = useState<LocationImpact[]>([]);

  useEffect(() => {
    // Process transactions to create location-based impact data
    const locationMap = new Map<string, LocationImpact>();
    
    recentTransactions.forEach(transaction => {
      const location = transaction.metadata?.location || 'Local Community';
      
      if (locationMap.has(location)) {
        const existing = locationMap.get(location)!;
        existing.count += 1;
        existing.points += transaction.points;
        if (new Date(transaction.timestamp) > new Date(existing.lastActivity)) {
          existing.lastActivity = transaction.timestamp;
        }
      } else {
        locationMap.set(location, {
          location,
          count: 1,
          points: transaction.points,
          lastActivity: transaction.timestamp,
          coordinates: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1
          }
        });
      }
    });
    
    setLocationData(Array.from(locationMap.values()).sort((a, b) => b.points - a.points));
  }, [recentTransactions]);

  const totalLocations = locationData.length;
  const totalImpactPoints = locationData.reduce((sum, loc) => sum + loc.points, 0);
  const mostActiveLocation = locationData[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-500" />
          <span>Geographic Impact</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Impact Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLocations}</div>
              <div className="text-sm text-gray-600">Locations Impacted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalImpactPoints}</div>
              <div className="text-sm text-gray-600">Total Impact Points</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {mostActiveLocation ? mostActiveLocation.location : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Most Active Area</div>
            </div>
          </div>

          {/* Visual Map Representation */}
          <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 min-h-64">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            
            {locationData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Start making an impact to see your geographic reach!</p>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-4 text-center">Your Impact Across Locations</h3>
                <div className="grid gap-3">
                  {locationData.map((location, index) => {
                    const intensity = (location.points / totalImpactPoints) * 100;
                    const size = Math.max(8, Math.min(24, (intensity / 10) + 8));
                    
                    return (
                      <div
                        key={location.location}
                        className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white/90 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              fontSize: `${Math.max(8, size / 3)}px`
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{location.location}</div>
                            <div className="text-sm text-gray-600">
                              {location.count} activities • Last: {new Date(location.lastActivity).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            {location.points} pts
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {intensity.toFixed(1)}% of total
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Geographic Insights */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Geographic Impact Insights</span>
            </div>
            <div className="text-sm text-green-700">
              {totalLocations > 0 ? (
                <>
                  You're making a difference across <strong>{totalLocations}</strong> location{totalLocations > 1 ? 's' : ''}! 
                  {mostActiveLocation && (
                    <> Your strongest impact is in <strong>{mostActiveLocation.location}</strong> with {mostActiveLocation.points} points.</>
                  )}
                </>
              ) : (
                'Start helping in your community to see your geographic impact!'
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicImpactMap;
