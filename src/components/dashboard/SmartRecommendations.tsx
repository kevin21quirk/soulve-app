
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import CompactRecommendationCard from "./CompactRecommendationCard";

const SmartRecommendations = () => {
  const { recommendations, handleRecommendationAction, handleImproveRecommendations } = useRecommendations();

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-lg text-purple-900">Smart Recommendations</CardTitle>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              AI
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleImproveRecommendations} className="text-purple-600 hover:text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            Improve
          </Button>
        </div>
        <CardDescription className="text-sm text-purple-700">
          Personalised suggestions based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendations.slice(0, 4).map((recommendation) => (
            <CompactRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={handleRecommendationAction}
            />
          ))}
        </div>
        
        {recommendations.length > 4 && (
          <div className="text-centre mt-3 pt-3 border-t border-purple-200">
            <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
              View All Recommendations
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
