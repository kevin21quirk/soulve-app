
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";

const RecommendationsSection = () => {
  const { recommendations } = useRecommendations();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Recommended for You</span>
          <Badge variant="secondary" className="text-xs">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.slice(0, 3).map((rec) => (
          <div key={rec.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{rec.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">{rec.confidence}% match</Badge>
                  <Badge variant="secondary" className="text-xs capitalize">{rec.type.replace('_', ' ')}</Badge>
                </div>
              </div>
              <Button size="sm" variant="gradient" className="ml-2">
                {rec.actionLabel}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
