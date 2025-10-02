import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, DollarSign, CheckCircle, Star, ArrowRight, Calendar, MapPin, Play } from "lucide-react";
import { TrustActivity } from "@/types/trustFootprint";
import { useState } from "react";
import ReliveMemoriesDashboard from "../relive/ReliveMemoriesDashboard";

interface ImpactFootprintProps {
  activities: TrustActivity[];
  userName: string;
}

const ImpactFootprint = ({ activities, userName }: ImpactFootprintProps) => {
  const [showReliveMemories, setShowReliveMemories] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "donation": return DollarSign;
      case "volunteer": return Clock;
      case "help_provided": return Users;
      case "help_received": return Heart;
      case "charity_support": return CheckCircle;
      default: return Star;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "donation": return "from-green-400 to-emerald-600";
      case "volunteer": return "from-blue-400 to-blue-600";
      case "help_provided": return "from-purple-400 to-purple-600";
      case "help_received": return "from-orange-400 to-orange-600";
      case "charity_support": return "from-teal-400 to-teal-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getEmotionalMessage = (activity: TrustActivity) => {
    switch (activity.type) {
      case "donation":
        return `${userName} made a difference by donating £${activity.amount} to ${activity.organization}`;
      case "volunteer":
        return `${userName} dedicated ${activity.hours} hours volunteering for ${activity.organization}`;
      case "help_provided":
        return `${userName} stepped up to help with ${activity.title.toLowerCase()}`;
      case "help_received":
        return `The community supported ${userName} with ${activity.title.toLowerCase()}`;
      case "charity_support":
        return `${userName} organized support for ${activity.organization}`;
      default:
        return `${userName} contributed to the community`;
    }
  };

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (showReliveMemories) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowReliveMemories(false)}
          className="mb-4"
        >
          <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
          Back to Impact Timeline
        </Button>
        <ReliveMemoriesDashboard />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
          <Heart className="h-6 w-6 text-red-500" />
          <span>Your Impact Journey</span>
        </CardTitle>
        <CardDescription className="text-lg">
          A storyboard of your community contributions and the lives you've touched
        </CardDescription>
        
        {/* Relive Memories Button */}
        <div className="pt-4">
          <Button
            onClick={() => setShowReliveMemories(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            size="lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Relive Your Memories
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Experience your journey through immersive story moments
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>
          
          <div className="space-y-8">
            {sortedActivities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const gradientColors = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="relative flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center shadow-lg`}>
                    <ActivityIcon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Story card */}
                  <Card className="flex-1 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {activity.title}
                          </h3>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {getEmotionalMessage(activity)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {activity.description}
                          </p>
                        </div>
                        <Badge 
                          variant={activity.status === "completed" || activity.status === "verified" ? "soulve" : "secondary"}
                          className="ml-4"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      
                      {/* Impact metrics */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(activity.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        {activity.organization && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{activity.organization}</span>
                          </div>
                        )}
                        {activity.amount && (
                          <div className="flex items-center space-x-1 text-green-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>${activity.amount}</span>
                          </div>
                        )}
                        {activity.hours && (
                          <div className="flex items-center space-x-1 text-blue-600 font-medium">
                            <Clock className="h-4 w-4" />
                            <span>{activity.hours} hours</span>
                          </div>
                        )}
                        {activity.recipients && (
                          <div className="flex items-center space-x-1 text-purple-600 font-medium">
                            <Users className="h-4 w-4" />
                            <span>{activity.recipients} people</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Impact story */}
                      {activity.impact && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                          <div className="flex items-start space-x-2">
                            <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Impact Story</p>
                              <p className="text-sm text-gray-700">{activity.impact}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Relive button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button 
                          variant="gradient" 
                          size="sm" 
                          className="text-white"
                          onClick={() => setShowReliveMemories(true)}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Relive this moment
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          {/* Journey continues message */}
          <div className="relative flex items-center justify-center mt-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-lg font-medium text-gray-900">Your journey continues...</p>
              <p className="text-gray-600">Every act of kindness creates ripples of positive change</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactFootprint;
