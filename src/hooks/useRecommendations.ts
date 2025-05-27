
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Recommendation } from "@/types/recommendations";
import { mockRecommendations } from "@/data/mockRecommendations";

export const useRecommendations = () => {
  const { toast } = useToast();
  const [recommendations] = useState<Recommendation[]>(mockRecommendations);

  const handleRecommendationAction = (recommendation: Recommendation) => {
    toast({
      title: "Action taken!",
      description: `${recommendation.actionLabel} for "${recommendation.title}"`,
    });
  };

  const handleImproveRecommendations = () => {
    toast({
      title: "Improving recommendations",
      description: "We'll analyze your activity to provide better suggestions",
    });
  };

  return {
    recommendations,
    handleRecommendationAction,
    handleImproveRecommendations,
  };
};
