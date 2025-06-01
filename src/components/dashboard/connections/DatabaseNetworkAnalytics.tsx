
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Users, MapPin, BarChart3, Activity } from "lucide-react";
import { DatabaseProfile } from "@/services/realConnectionsService";

interface DatabaseNetworkAnalyticsProps {
  connectedPeople: Array<{
    id: string;
    partner_id: string;
    partner_profile: DatabaseProfile | null;
  }>;
  onClose: () => void;
}

const DatabaseNetworkAnalytics = ({ connectedPeople, onClose }: DatabaseNetworkAnalyticsProps) => {
  // Calculate analytics data
  const validProfiles = connectedPeople.filter(conn => conn.partner_profile).map(conn => conn.partner_profile!);
  
  const skillDistribution = validProfiles
    .flatMap(profile => profile.skills || [])
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const locationDistribution = validProfiles
    .map(profile => profile.location || 'Unknown')
    .filter(location => location !== 'Unknown')
    .reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSkills = Object.entries(skillDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topLocations = Object.entries(locationDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const analytics = [
    {
      title: "Network Size",
      value: connectedPeople.length,
      description: "Total connections",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Avg Trust Score",
      value: "85%",
      description: "Network reliability",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Geographic Reach",
      value: Object.keys(locationDistribution).length,
      description: "Different locations",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Skills Diversity",
      value: Object.keys(skillDistribution).length,
      description: "Unique skills",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Network Analytics</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className={`inline-flex p-3 rounded-full ${metric.bgColor} mb-2`}>
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm font-medium text-gray-700">{metric.title}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Skills */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Top Skills in Network</h4>
            <div className="space-y-2">
              {topSkills.length > 0 ? topSkills.map(([skill, count], index) => {
                const percentage = Math.round((count / validProfiles.length) * 100);
                return (
                  <div key={skill} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{count} people</Badge>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-500 text-sm">No skills data available</p>
              )}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Geographic Distribution</h4>
            <div className="space-y-2">
              {topLocations.length > 0 ? topLocations.map(([location, count], index) => {
                const percentage = Math.round((count / validProfiles.length) * 100);
                return (
                  <div key={location} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{count} people</Badge>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-500 text-sm">No location data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Network Health */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3">Network Health Score</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">A+</div>
              <div className="text-sm text-green-700">Trust Quality</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">B+</div>
              <div className="text-sm text-blue-700">Diversity</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">A</div>
              <div className="text-sm text-purple-700">Engagement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseNetworkAnalytics;
