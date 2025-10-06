import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface UserFeedback {
  id: string;
  feedback_type: 'bug' | 'feature_request' | 'ui_issue' | 'performance' | 'general';
  title: string;
  description: string;
  page_url: string | null;
  page_section: string | null;
  screenshot_url: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_review' | 'in_progress' | 'resolved' | 'wont_fix';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface UseUserFeedbackOptions {
  status?: 'new' | 'in_review' | 'in_progress' | 'resolved' | 'wont_fix';
}

export const useUserFeedback = (options?: UseUserFeedbackOptions) => {
  const query = useQuery({
    queryKey: ['user-feedback', options?.status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('platform_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserFeedback[];
    },
  });

  // Real-time subscription for feedback updates
  useEffect(() => {
    const channel = supabase
      .channel('user-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_feedback',
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
