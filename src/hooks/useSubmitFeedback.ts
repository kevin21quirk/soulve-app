import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface FeedbackSubmission {
  feedback_type: 'bug' | 'feature_request' | 'ui_issue' | 'performance' | 'general';
  title: string;
  description: string;
  page_section?: string;
  screenshot?: File;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

interface BrowserInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  platform: string;
}

const getBrowserInfo = (): BrowserInfo => {
  return {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    platform: navigator.platform,
  };
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  const { api } = useAuth();

  return useMutation({
    mutationFn: async (feedback: FeedbackSubmission) => {
      if (!api) throw new Error('Not authenticated');

      // 1. Create the feedback record first — it is the parent record that the
      //    screenshot upload authorizes against.
      const created = await api.post<{ id: string }>('/feedback', {
        feedback_type: feedback.feedback_type,
        title: feedback.title,
        description: feedback.description,
        page_url: window.location.href,
        page_section: feedback.page_section ?? null,
        browser_info: getBrowserInfo(),
        priority: feedback.urgency || 'medium',
      });

      // 2. Upload the screenshot against the feedback record. If it fails the
      //    feedback still exists (screenshot is optional).
      if (feedback.screenshot) {
        try {
          const form = new FormData();
          form.append('file', feedback.screenshot);
          form.append('folder', 'feedback-screenshots');
          form.append('recordId', created.id);
          await api.upload('/upload', form);
        } catch (err) {
          console.error('Screenshot upload failed — feedback kept without it:', err);
        }
      }

      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['impact-metrics'] });
      
      toast({
        title: "Feedback Submitted! 🎉",
        description: `Thank you for helping us improve! You earned 10 XP. Reference: ${data.id.slice(0, 8)}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
};
