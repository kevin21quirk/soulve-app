
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CompactRecommendationCard from "./CompactRecommendationCard";
import { useRealRecommendations } from "@/hooks/useRealRecommendations";

const SmartRecommendations = () => {
  const { 
    recommendations, 
    isLoading, 
    isAuthenticated,
    handleRecommendationAction, 
    handleImproveRecommendations,
    refreshRecommendations 
  } = useRealRecommendations();
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return (
      <Card className="bg-gradient-to-r from-[#4c3dfb]/10 to-[#18a5fe]/10 border-[#4c3dfb]/30 w-full">
        <CardHeader className={`${isMobile ? 'p-3 pb-2' : 'pb-3'}`}>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#4c3dfb] flex-shrink-0" />
            <CardTitle className={`text-[#4c3dfb] ${isMobile ? 'text-base' : 'text-lg'}`}>
              Smart Recommendations
            </CardTitle>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#4c3dfb] to-[#18a5fe] text-white text-xs">
              AI
            </Badge>
          </div>
          <CardDescription className={`text-[#4c3dfb]/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Sign in to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-0'}`}>
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-3">
              Connect with like-minded people and discover opportunities tailored to your interests
            </p>
            <Button variant="outline" size="sm" className="text-[#4c3dfb] border-[#4c3dfb]/30">
              Sign In to Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-[#4c3dfb]/10 to-[#18a5fe]/10 border-[#4c3dfb]/30 w-full">
      <CardHeader className={`${isMobile ? 'p-3 pb-2' : 'pb-3'}`}>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#4c3dfb] flex-shrink-0" />
            <CardTitle className={`text-[#4c3dfb] ${isMobile ? 'text-base' : 'text-lg'}`}>
              Smart Recommendations
            </CardTitle>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#4c3dfb] to-[#18a5fe] text-white text-xs">
              AI
            </Badge>
            {!isMobile && (
              <div className="flex items-center gap-1 ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={refreshRecommendations} 
                  disabled={isLoading}
                  className="text-[#4c3dfb] hover:text-[#4c3dfb]/80 flex items-center gap-1 px-2 py-1 h-auto"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-xs">Refresh</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleImproveRecommendations} 
                  disabled={isLoading}
                  className="text-[#4c3dfb] hover:text-[#4c3dfb]/80 flex items-center gap-1 px-2 py-1 h-auto"
                >
                  <Brain className="h-3 w-3" />
                  <span className="text-xs">Improve</span>
                </Button>
              </div>
            )}
          </div>
          
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshRecommendations} 
                disabled={isLoading}
                className="text-[#4c3dfb] hover:text-[#4c3dfb]/80 flex items-center justify-center gap-2 flex-1"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleImproveRecommendations} 
                disabled={isLoading}
                className="text-[#4c3dfb] hover:text-[#4c3dfb]/80 flex items-center justify-center gap-2 flex-1"
              >
                <Brain className="h-4 w-4" />
                <span className="text-sm">Improve</span>
              </Button>
            </div>
          )}
        </div>
        
        <CardDescription className={`text-[#4c3dfb]/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {isLoading ? 'Generating personalized suggestions...' : 'Based on your profile and activity'}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-0'}`}>
        {isLoading ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border border-purple-200 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className={`grid gap-3 ${
              isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {recommendations.slice(0, isMobile ? 2 : 4).map((recommendation) => (
                <CompactRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onAction={handleRecommendationAction}
                />
              ))}
            </div>
            
            {recommendations.length > (isMobile ? 2 : 4) && (
              <div className="text-center mt-3 pt-3 border-t border-[#4c3dfb]/20">
                <Button variant="outline" size="sm" className="text-[#4c3dfb] border-[#4c3dfb]/30 hover:bg-[#4c3dfb]/10">
                  View All Recommendations
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-3">
              Complete your profile to get personalized recommendations
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImproveRecommendations}
              className="text-[#4c3dfb] border-[#4c3dfb]/30"
            >
              Set Up Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
