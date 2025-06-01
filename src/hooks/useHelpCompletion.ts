
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HelpCompletionService } from '@/services/helpCompletionService';
import { EnhancedPointsService } from '@/services/enhancedPointsService';
import { HelpCompletionRequest, CreateHelpCompletionRequest, ReviewHelpCompletionRequest } from '@/types/helpCompletion';

export const useHelpCompletion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<HelpCompletionRequest[]>([]);
  const [myRequests, setMyRequests] = useState<HelpCompletionRequest[]>([]);

  const loadPendingRequests = async () => {
    if (!user?.id) return;
    
    try {
      const requests = await HelpCompletionService.getCompletionRequestsForRequester(user.id);
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const loadMyRequests = async () => {
    if (!user?.id) return;
    
    try {
      const requests = await HelpCompletionService.getCompletionRequestsForHelper(user.id);
      setMyRequests(requests);
    } catch (error) {
      console.error('Error loading my requests:', error);
    }
  };

  const createCompletionRequest = async (
    postId: string,
    requesterId: string,
    data: CreateHelpCompletionRequest
  ) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit help completion.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await HelpCompletionService.createCompletionRequest(
        postId,
        user.id,
        requesterId,
        data
      );
      
      toast({
        title: "Help Completion Submitted! 🎉",
        description: "Waiting for confirmation from the person you helped.",
      });
      
      await loadMyRequests();
    } catch (error) {
      console.error('Error creating completion request:', error);
      toast({
        title: "Error",
        description: "Failed to submit help completion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reviewCompletionRequest = async (
    requestId: string,
    review: ReviewHelpCompletionRequest
  ) => {
    setLoading(true);
    try {
      await HelpCompletionService.reviewCompletionRequest(requestId, review);
      
      const statusMessage = review.status === 'approved' 
        ? "Help Approved! ✅ Points have been awarded!" 
        : "Help completion has been rejected.";
      
      toast({
        title: statusMessage,
        description: review.status === 'approved' 
          ? `Rating: ${review.feedback_rating}/5 stars`
          : review.feedback_message || "Completion was not verified.",
      });
      
      await loadPendingRequests();
    } catch (error) {
      console.error('Error reviewing completion request:', error);
      toast({
        title: "Error",
        description: "Failed to review help completion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPendingRequests();
      loadMyRequests();
    }
  }, [user?.id]);

  return {
    loading,
    pendingRequests,
    myRequests,
    createCompletionRequest,
    reviewCompletionRequest,
    loadPendingRequests,
    loadMyRequests
  };
};
