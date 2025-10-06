import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const uploadScreenshot = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('feedback-screenshots')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('feedback-screenshots')
    .getPublicUrl(data.path);

  return publicUrl;
};

const awardFeedbackPoints = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('impact_activities')
      .insert({
        user_id: userId,
        activity_type: 'platform_engagement',
        points_earned: 10,
        description: 'Provided platform feedback',
        metadata: {
          source: 'feedback_system',
          timestamp: new Date().toISOString()
        },
        verified: true
      });

    if (error) {
      console.error('Error awarding feedback points:', error);
    }
  } catch (err) {
    console.error('Error awarding feedback points:', err);
  }
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: FeedbackSubmission) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let screenshotUrl: string | undefined;

      if (feedback.screenshot) {
        screenshotUrl = await uploadScreenshot(feedback.screenshot, user.id);
      }

      const { data, error } = await supabase
        .from('platform_feedback')
        .insert([{
          user_id: user.id,
          feedback_type: feedback.feedback_type,
          title: feedback.title,
          description: feedback.description,
          page_url: window.location.href,
          page_section: feedback.page_section,
          screenshot_url: screenshotUrl,
          browser_info: getBrowserInfo() as any,
          priority: feedback.urgency || 'medium',
        }])
        .select()
        .single();

      if (error) throw error;

      // Award XP points for providing feedback
      await awardFeedbackPoints(user.id);

      return data;
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
