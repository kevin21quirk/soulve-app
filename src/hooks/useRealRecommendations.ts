
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Recommendation } from "@/types/recommendations";
import { RecommendationService } from "@/services/recommendationService";
import { supabase } from "@/integrations/supabase/client";

export const useRealRecommendations = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        loadRecommendations(user.id);
      } else {
        setIsLoading(false);
        setRecommendations([]);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          loadRecommendations(session.user.id);
        } else {
          setCurrentUser(null);
          setRecommendations([]);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadRecommendations = async (userId: string) => {
    try {
      setIsLoading(true);
      console.log('Loading recommendations for user:', userId);
      
      const recs = await RecommendationService.getCachedRecommendations(userId);
      setRecommendations(recs);
      
      console.log('Loaded recommendations:', recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Error loading recommendations",
        description: "Using fallback recommendations",
        variant: "destructive",
      });
      
      // Set fallback recommendations
      setRecommendations([
        {
          id: "fallback-1",
          type: "connection",
          title: "Complete your profile",
          description: "Add your skills and interests to get personalized recommendations",
          confidence: 70,
          reasoning: "Profile completion helps us match you better",
          actionLabel: "Update Profile",
          data: {}
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationAction = async (recommendation: Recommendation) => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to perform this action",
        variant: "destructive",
      });
      return;
    }

    // Track the interaction
    await RecommendationService.trackInteraction(
      currentUser.id,
      'view',
      recommendation.type === 'connection' ? recommendation.data.target_id : undefined,
      recommendation.type === 'help_opportunity' ? recommendation.data.target_id : undefined
    );

    toast({
      title: "Action taken!",
      description: `${recommendation.actionLabel} for "${recommendation.title}"`,
    });
  };

  const handleImproveRecommendations = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to improve recommendations",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Improving recommendations",
        description: "Analyzing your profile and activity...",
      });

      // Force regenerate recommendations
      await RecommendationService.syncUserPreferences(currentUser.id);
      const newRecs = await RecommendationService.generateRecommendations(currentUser.id);
      setRecommendations(newRecs);

      toast({
        title: "Recommendations updated!",
        description: "We've personalized your suggestions based on your latest activity",
      });
    } catch (error) {
      console.error('Error improving recommendations:', error);
      toast({
        title: "Error updating recommendations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    if (currentUser) {
      await loadRecommendations(currentUser.id);
    }
  };

  return {
    recommendations,
    isLoading,
    isAuthenticated: !!currentUser,
    handleRecommendationAction,
    handleImproveRecommendations,
    refreshRecommendations,
  };
};
