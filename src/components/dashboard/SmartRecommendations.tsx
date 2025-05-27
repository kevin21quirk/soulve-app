
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Recommendation } from "@/types/recommendations";
import RecommendationCard from "./RecommendationCard";

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
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onAction={handleRecommendationAction}
          />
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
