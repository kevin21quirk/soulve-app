import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Lightbulb, TrendingUp, Clock, Sparkles, CheckCircle, X, AlertCircle } from "lucide-react";
import { useAIESGRecommendations } from "@/hooks/esg/useAIESGRecommendations";

interface Recommendation {
  id: string;
  title: string;
  recommendation_type: string;
  priority_score: number;
  description: string;
  implementation_effort: string;
  potential_impact: string;
  status: string;
}

interface ESGRecommendationsCardProps {
  organizationId?: string;
  recommendations?: Recommendation[]; // Fallback mock data
  isLoading?: boolean;
}

const ESGRecommendationsCard = ({ organizationId, recommendations: fallbackRecs = [], isLoading: propLoading = false }: ESGRecommendationsCardProps) => {
  const { data: aiRecommendations, isLoading: aiLoading, error } = useAIESGRecommendations(organizationId);
  
  // Use AI recommendations if available, otherwise fallback to mock data
  const recommendations = aiRecommendations && aiRecommendations.length > 0 ? aiRecommendations : fallbackRecs;
  const isLoading = propLoading || aiLoading;
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'efficiency':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'best_practice':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'risk_mitigation':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-orange-600" />;
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm">
        <LoadingState message="Generating AI-powered recommendations from your ESG data..." size="md" />
      </Card>
    );
  }

  // Show error state with proper messaging
  if (error && !recommendations.length) {
    const errorMessage = (error as Error).message;
    let errorTitle = "Unable to Load Recommendations";
    let errorDesc = "We encountered an issue while fetching AI recommendations.";
    
    if (errorMessage === 'AI_RATE_LIMIT') {
      errorTitle = "Rate Limit Reached";
      errorDesc = "You've reached the hourly limit for AI requests. Please try again later.";
    } else if (errorMessage === 'AI_CREDITS_DEPLETED') {
      errorTitle = "AI Credits Depleted";
      errorDesc = "Please add more AI credits to continue using AI-powered features.";
    } else if (errorMessage === 'UNAUTHORIZED') {
      errorTitle = "Access Denied";
      errorDesc = "You don't have permission to access this organization's AI insights.";
    }

    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm">
        <EmptyState
          icon={AlertCircle}
          title={errorTitle}
          description={errorDesc}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI-Powered Recommendations</h3>
            <p className="text-xs text-muted-foreground">Generated from your ESG data</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {recommendations.filter(r => r.status === 'new').length} New
        </Badge>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, 3).map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant="outline" className={`${getTypeColor(rec.recommendation_type)} text-xs`}>
                    {rec.recommendation_type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {rec.description}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {getPriorityIcon(rec.priority_score)}
                <span className="text-sm font-medium">{rec.priority_score}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Effort:</span>
                <span className={`font-medium ${getEffortColor(rec.implementation_effort)}`}>
                  {rec.implementation_effort}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Impact:</span>
                <span className="font-medium text-green-600">High</span>
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded text-xs text-muted-foreground mb-3">
              <strong>Potential Impact:</strong> {rec.potential_impact}
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={rec.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
              >
                {rec.status === 'new' ? 'New' : rec.status}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
                <Button size="sm" className="h-7 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All {recommendations.length} Recommendations
          </Button>
        </div>
      )}

      {!error && recommendations.length === 0 && !isLoading && (
        <EmptyState
          icon={Sparkles}
          title="No Recommendations Yet"
          description="AI recommendations will appear here once you've added ESG data to your organization."
        />
      )}

      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <p className="text-xs text-muted-foreground">
          AI-powered recommendations are generated based on your ESG data, industry benchmarks, and best practices. 
          Recommendations are updated automatically as new data becomes available.
        </p>
      </div>
    </Card>
  );
};

export default ESGRecommendationsCard;