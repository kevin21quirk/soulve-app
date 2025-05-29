
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, Calendar, MapPin } from "lucide-react";

interface InterestRecommendation {
  id: string;
  type: "person" | "group" | "event";
  title: string;
  description: string;
  image: string;
  interests: string[];
  location?: string;
  memberCount?: number;
  date?: string;
  matchScore: number;
}

interface InterestBasedRecommendationsProps {
  onAction: (id: string, type: string) => void;
}

const InterestBasedRecommendations = ({ onAction }: InterestBasedRecommendationsProps) => {
  const [recommendations] = useState<InterestRecommendation[]>([
    {
      id: "1",
      type: "group",
      title: "Local Photography Club",
      description: "Weekly photo walks and workshops for all skill levels",
      image: "/placeholder.svg",
      interests: ["Photography", "Art", "Nature"],
      location: "Central Park",
      memberCount: 156,
      matchScore: 94
    },
    {
      id: "2",
      type: "event",
      title: "Community Garden Volunteer Day",
      description: "Help plant vegetables and flowers in our community garden",
      image: "/placeholder.svg",
      interests: ["Gardening", "Environment", "Community"],
      location: "Green Valley Community Garden",
      date: "This Saturday",
      matchScore: 89
    },
    {
      id: "3",
      type: "person",
      title: "Jamie Collins",
      description: "Fellow book lover and writing enthusiast looking to start a book club",
      image: "/placeholder.svg",
      interests: ["Reading", "Writing", "Literature"],
      location: "Downtown Library",
      matchScore: 91
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "group": return Users;
      case "event": return Calendar;
      case "person": return Heart;
      default: return Heart;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case "group": return "Join Group";
      case "event": return "Join Event";
      case "person": return "Connect";
      default: return "Connect";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Heart className="h-5 w-5 text-pink-500" />
          <span>Based on Your Interests</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const IconComponent = getIcon(rec.type);
          return (
            <div key={rec.id} className="p-3 border rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-start space-x-3 mb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={rec.image} alt={rec.title} />
                  <AvatarFallback>
                    <IconComponent className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {rec.matchScore}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  
                  {rec.location && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{rec.location}</span>
                    </div>
                  )}
                  
                  {rec.memberCount && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <Users className="h-3 w-3" />
                      <span>{rec.memberCount} members</span>
                    </div>
                  )}
                  
                  {rec.date && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{rec.date}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <Button
                size="sm"
                variant="gradient"
                className="w-full"
                onClick={() => onAction(rec.id, rec.type)}
              >
                <IconComponent className="h-4 w-4 mr-1" />
                {getActionLabel(rec.type)}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default InterestBasedRecommendations;
