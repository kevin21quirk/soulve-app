
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import CompactRecommendationCard from "./CompactRecommendationCard";

const SmartRecommendations = () => {
  const { recommendations, handleRecommendationAction, handleImproveRecommendations } = useRecommendations();

  return (
    <Card className="bg-gradient-to-r from-[#4c3dfb]/10 to-[#18a5fe]/10 border-[#4c3dfb]/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-[#4c3dfb]" />
            <CardTitle className="text-lg text-[#4c3dfb]">Smart Recommendations</CardTitle>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#4c3dfb] to-[#18a5fe] text-white text-xs">
              AI
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleImproveRecommendations} className="text-[#4c3dfb] hover:text-[#4c3dfb]/80">
            <Brain className="h-3 w-3 mr-1" />
            Improve
          </Button>
        </div>
        <CardDescription className="text-sm text-[#4c3dfb]/80">
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
          <div className="text-centre mt-3 pt-3 border-t border-[#4c3dfb]/20">
            <Button variant="outline" size="sm" className="text-[#4c3dfb] border-[#4c3dfb]/30 hover:bg-[#4c3dfb]/10">
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
