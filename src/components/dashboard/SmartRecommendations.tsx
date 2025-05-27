
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import RecommendationCard from "./RecommendationCard";

const SmartRecommendations = () => {
  const { recommendations, handleRecommendationAction, handleImproveRecommendations } = useRecommendations();

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
          <Button variant="outline" size="sm" onClick={handleImproveRecommendations}>
            <Brain className="h-4 w-4 mr-2" />
            Improve Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
