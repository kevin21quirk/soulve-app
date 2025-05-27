
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, MessageSquare, MapPin, Clock, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  type: "connection" | "post" | "help_opportunity" | "skill_match";
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionLabel: string;
  data: any;
}

const SmartRecommendations = () => {
  const { toast } = useToast();
  const [recommendations] = useState<Recommendation[]>([
    {
      id: "1",
      type: "connection",
      title: "Connect with Maria Santos",
      description: "Licensed nurse in your area with 96% trust score",
      confidence: 92,
      reasoning: "Based on your interest in healthcare and community service",
      actionLabel: "Send Request",
      data: {
        user: "Maria Santos",
        avatar: "",
        location: "0.8 miles away",
        mutualConnections: 3,
        skills: ["Healthcare", "Senior Care"]
      }
    },
    {
      id: "2",
      type: "help_opportunity",
      title: "Dog Walking Opportunity",
      description: "Alex Rodriguez needs help with daily dog walks",
      confidence: 88,
      reasoning: "Matches your pet care skills and availability",
      actionLabel: "Offer Help",
      data: {
        location: "Maple Street",
        timeCommitment: "30 min daily",
        compensation: "$20 per walk",
        urgency: "high"
      }
    },
    {
      id: "3",
      type: "skill_match",
      title: "Tutoring Opportunity",
      description: "High school student needs math tutoring",
      confidence: 85,
      reasoning: "Your teaching background and high ratings in education",
      actionLabel: "Learn More",
      data: {
        subject: "Algebra & Geometry",
        schedule: "Weekends",
        level: "High School",
        remote: true
      }
    },
    {
      id: "4",
      type: "post",
      title: "Community Garden Project",
      description: "New volunteer opportunity at Riverside Park",
      confidence: 78,
      reasoning: "Your environmental interests and past gardening activities",
      actionLabel: "Join Project",
      data: {
        organizer: "Green Community Initiative",
        date: "This Saturday",
        volunteers: 12,
        impact: "200 new plants"
      }
    }
  ]);

  const handleRecommendationAction = (recommendation: Recommendation) => {
    toast({
      title: "Action taken!",
      description: `${recommendation.actionLabel} for "${recommendation.title}"`,
    });
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "connection": return <Users className="h-5 w-5 text-blue-500" />;
      case "post": return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "help_opportunity": return <Star className="h-5 w-5 text-orange-500" />;
      case "skill_match": return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default: return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100";
    if (confidence >= 80) return "text-blue-600 bg-blue-100";
    if (confidence >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Smart Recommendations</span>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Personalized suggestions based on your activity and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getRecommendationIcon(recommendation.type)}
                <div>
                  <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                </div>
              </div>
              <Badge className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
                {recommendation.confidence}% match
              </Badge>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">
                <Brain className="h-3 w-3 inline mr-1" />
                Why this recommendation: {recommendation.reasoning}
              </p>
            </div>

            {/* Recommendation-specific data */}
            {recommendation.type === "connection" && (
              <div className="bg-blue-50 p-3 rounded-md mb-3">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recommendation.data.avatar} />
                    <AvatarFallback className="text-xs">
                      {recommendation.data.user.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{recommendation.data.user}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{recommendation.data.location}</span>
                      <span>•</span>
                      <span>{recommendation.data.mutualConnections} mutual connections</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recommendation.data.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {recommendation.type === "help_opportunity" && (
              <div className="bg-orange-50 p-3 rounded-md mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span>{recommendation.data.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>{recommendation.data.timeCommitment}</span>
                  </div>
                  <div className="col-span-2 font-medium text-green-600">
                    {recommendation.data.compensation}
                  </div>
                </div>
              </div>
            )}

            {recommendation.type === "skill_match" && (
              <div className="bg-purple-50 p-3 rounded-md mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Subject:</strong> {recommendation.data.subject}</div>
                  <div><strong>Schedule:</strong> {recommendation.data.schedule}</div>
                  <div><strong>Level:</strong> {recommendation.data.level}</div>
                  <div>
                    <Badge variant={recommendation.data.remote ? "default" : "outline"} className="text-xs">
                      {recommendation.data.remote ? "Remote" : "In-person"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {recommendation.type === "post" && (
              <div className="bg-green-50 p-3 rounded-md mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Organizer:</strong> {recommendation.data.organizer}</div>
                  <div><strong>Date:</strong> {recommendation.data.date}</div>
                  <div><strong>Volunteers:</strong> {recommendation.data.volunteers} joined</div>
                  <div><strong>Impact:</strong> {recommendation.data.impact}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                onClick={() => handleRecommendationAction(recommendation)}
                size="sm"
                className="flex-1 mr-2"
              >
                {recommendation.actionLabel}
              </Button>
              <Button variant="outline" size="sm">
                Not Interested
              </Button>
            </div>
          </div>
        ))}

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-500 mb-2">
            Recommendations update based on your activity
          </p>
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Improve Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
