
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Lightbulb } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";

interface ConnectionInsightsProps {
  connectedPeople: ConnectionRequest[];
  suggestedConnections: ConnectionRequest[];
}

const ConnectionInsights = ({ connectedPeople, suggestedConnections }: ConnectionInsightsProps) => {
  // Calculate insights from connections
  const topSkills = connectedPeople
    .flatMap(person => person.skills || [])
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topLocations = connectedPeople
    .map(person => person.location)
    .reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSkillsArray = Object.entries(topSkills)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topLocationsArray = Object.entries(topLocations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const insights = [
    {
      title: "Network Growth",
      value: "+23%",
      description: "Your network grew by 23% this month",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Connection Quality",
      value: "94%",
      description: "Average trust score of your connections",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Geographic Reach",
      value: `${topLocationsArray.length}`,
      description: "Cities in your network",
      icon: MapPin,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Network Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <IconComponent className={`h-8 w-8 mx-auto mb-2 ${insight.color}`} />
                  <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
                  <div className="text-sm font-medium text-gray-700">{insight.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{insight.description}</div>
                </div>
              );
            })}
          </div>

          {/* Top Skills in Network */}
          {topSkillsArray.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Skills in Your Network</h4>
              <div className="flex flex-wrap gap-2">
                {topSkillsArray.map(([skill, count]) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Geographic Distribution */}
          {topLocationsArray.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Geographic Distribution</h4>
              <div className="flex flex-wrap gap-2">
                {topLocationsArray.map(([location, count]) => (
                  <Badge key={location} variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {location} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="font-medium text-sm">Find Local Helpers</div>
            <div className="text-xs text-gray-500">Discover people in your area</div>
          </div>
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="font-medium text-sm">Join Community Groups</div>
            <div className="text-xs text-gray-500">Connect with like-minded people</div>
          </div>
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="font-medium text-sm">Browse Campaigns</div>
            <div className="text-xs text-gray-500">Support meaningful causes</div>
          </div>
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="font-medium text-sm">Share Your Skills</div>
            <div className="text-xs text-gray-500">Offer help to others</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionInsights;
