
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HelpCompletionService } from '@/services/helpCompletionService';
import { CreateHelpCompletionRequest, HelpCompletionRequest, ReviewHelpCompletionRequest } from '@/types/helpCompletion';

export const useHelpCompletion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<HelpCompletionRequest[]>([]);
  const [myRequests, setMyRequests] = useState<HelpCompletionRequest[]>([]);

  const loadCompletionRequests = async () => {
    if (!user?.id) return;

    try {
      const [pending, mine] = await Promise.all([
        HelpCompletionService.getCompletionRequestsForRequester(user.id),
        HelpCompletionService.getCompletionRequestsForHelper(user.id)
      ]);

      setPendingRequests(pending);
      setMyRequests(mine);
    } catch (error) {
      console.error('Error loading completion requests:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCompletionRequests();
    }
  }, [user?.id]);

  const createCompletionRequest = async (
    postId: string,
    requesterId: string,
    data: CreateHelpCompletionRequest
  ) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to mark help as completed.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const result = await HelpCompletionService.createCompletionRequest(
        postId,
        user.id,
        requesterId,
        data
      );

      toast({
        title: "Help Completion Submitted! 🎉",
        description: "The person you helped will be notified to review and rate your assistance.",
      });

      await loadCompletionRequests();
      return result;
    } catch (error) {
      console.error('Error creating completion request:', error);
      toast({
        title: "Error",
        description: "Failed to submit help completion. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reviewCompletionRequest = async (
    requestId: string,
    review: ReviewHelpCompletionRequest
  ) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to review help completion.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const result = await HelpCompletionService.reviewCompletionRequest(requestId, review);

      toast({
        title: review.status === 'approved' ? "Help Approved! ⭐" : "Review Submitted",
        description: review.status === 'approved' 
          ? "Points have been awarded to the helper." 
          : "Your feedback has been recorded.",
      });

      await loadCompletionRequests();
      return result;
    } catch (error) {
      console.error('Error reviewing completion request:', error);
      toast({
        title: "Error",
        description: "Failed to review help completion. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pendingRequests,
    myRequests,
    createCompletionRequest,
    reviewCompletionRequest,
    loadCompletionRequests
  };
};
