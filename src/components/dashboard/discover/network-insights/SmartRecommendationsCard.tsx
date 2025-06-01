
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { useNetworkNavigation } from "@/hooks/useNetworkNavigation";

interface Recommendation {
  id: string;
  type: 'person' | 'group' | 'campaign';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  data: any;
}

interface SmartRecommendationsCardProps {
  recommendations: Recommendation[];
}

const SmartRecommendationsCard = ({ recommendations }: SmartRecommendationsCardProps) => {
  const navigation = useNetworkNavigation();

  if (recommendations.length === 0) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <span>Smart Recommendations</span>
          <Badge className="bg-blue-600 text-white">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => (
            <div key={rec.id} className="p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={rec.type === 'person' ? 'default' : rec.type === 'group' ? 'secondary' : 'outline'}>
                  {rec.type}
                </Badge>
                <div className="text-xs text-green-600 font-medium">{rec.confidence}% match</div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
              <p className="text-xs text-blue-600 mb-3">{rec.reason}</p>
              <Button size="sm" variant="gradient" className="w-full" 
                onClick={rec.type === 'person' ? navigation.navigateToDiscover : 
                         rec.type === 'group' ? navigation.navigateToGroups : 
                         navigation.navigateToCampaigns}>
                <ArrowRight className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsCard;
