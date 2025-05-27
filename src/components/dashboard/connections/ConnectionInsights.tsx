
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lightbulb, UserPlus, Users, TrendingUp, MapPin, Clock } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";

interface ConnectionInsightsProps {
  connectedPeople: ConnectionRequest[];
  suggestedConnections: ConnectionRequest[];
}

const ConnectionInsights = ({ connectedPeople, suggestedConnections }: ConnectionInsightsProps) => {
  // Smart insights based on network data
  const getNetworkInsights = () => {
    const insights = [];

    // Location diversity insight
    const locations = [...new Set(connectedPeople.map(p => p.location))];
    if (locations.length >= 3) {
      insights.push({
        type: "diversity",
        title: "Great location diversity!",
        description: `You're connected to people in ${locations.length} different areas: ${locations.slice(0, 3).join(", ")}.`,
        icon: MapPin,
        color: "bg-green-50 border-green-200 text-green-800"
      });
    }

    // High trust score insight
    const highTrustConnections = connectedPeople.filter(p => p.trustScore >= 90).length;
    if (highTrustConnections >= 3) {
      insights.push({
        type: "trust",
        title: "High-trust network",
        description: `${highTrustConnections} of your connections have 90%+ trust scores. This shows excellent relationship quality.`,
        icon: TrendingUp,
        color: "bg-blue-50 border-blue-200 text-blue-800"
      });
    }

    // Skill matching insight
    const allSkills = connectedPeople.flatMap(p => p.skills);
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const popularSkill = Object.entries(skillCounts).sort(([,a], [,b]) => b - a)[0];
    
    if (popularSkill && popularSkill[1] >= 3) {
      insights.push({
        type: "skills",
        title: "Strong skill cluster",
        description: `You have ${popularSkill[1]} connections with "${popularSkill[0]}" skills. Consider leveraging this network for collaborations.`,
        icon: Users,
        color: "bg-purple-50 border-purple-200 text-purple-800"
      });
    }

    return insights;
  };

  // Smart connection suggestions based on network analysis
  const getSmartSuggestions = () => {
    const suggestions = [];

    // Find connections with high mutual connections
    const highMutualConnections = suggestedConnections
      .filter(p => p.mutualConnections >= 3)
      .sort((a, b) => b.mutualConnections - a.mutualConnections)
      .slice(0, 3);

    if (highMutualConnections.length > 0) {
      suggestions.push({
        type: "mutual",
        title: "High mutual connections",
        people: highMutualConnections,
        reason: "These people have many mutual connections with you"
      });
    }

    // Find connections in same location but different skills
    const myLocations = [...new Set(connectedPeople.map(p => p.location))];
    const mySkills = [...new Set(connectedPeople.flatMap(p => p.skills))];
    
    const diverseSkillsSameLocation = suggestedConnections
      .filter(p => myLocations.includes(p.location))
      .filter(p => !p.skills.some(skill => mySkills.includes(skill)))
      .slice(0, 2);

    if (diverseSkillsSameLocation.length > 0) {
      suggestions.push({
        type: "skills",
        title: "Expand your skill network",
        people: diverseSkillsSameLocation,
        reason: "Same location, different skills - perfect for learning new things"
      });
    }

    return suggestions.slice(0, 2);
  };

  const insights = getNetworkInsights();
  const smartSuggestions = getSmartSuggestions();

  return (
    <div className="space-y-6">
      {/* Network Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Network Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${insight.color}`}>
                  <div className="flex items-start space-x-3">
                    <insight.icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs opacity-90">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Connection Suggestions */}
      {smartSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              <span>Smart Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {smartSuggestions.map((suggestion, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.people.length} {suggestion.people.length === 1 ? "person" : "people"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{suggestion.reason}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestion.people.map(person => (
                    <div key={person.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback className="text-xs">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{person.name}</h5>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{person.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{person.mutualConnections} mutual</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Grow Your Network</h4>
              <p className="text-sm text-gray-600">Discover more meaningful connections in your community</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                View Activity
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Find People
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionInsights;
