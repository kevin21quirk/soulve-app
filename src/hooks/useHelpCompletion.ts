
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HelpCompletionService } from '@/services/helpCompletionService';
import { CreateHelpCompletionRequest, HelpCompletionRequest } from '@/types/helpCompletion';

export const useHelpCompletion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return {
    createCompletionRequest,
    loading
  };
};
