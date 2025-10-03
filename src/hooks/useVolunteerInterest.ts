import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVolunteerInterest = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVolunteerInterest = async (
    postId: string,
    postAuthorId: string,
    message?: string
  ) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create volunteer interest
      const { error: volunteerError } = await supabase
        .from('volunteer_interests')
        .insert({
          post_id: postId,
          volunteer_id: user.id,
          message: message || null,
          status: 'pending'
        });

      if (volunteerError) throw volunteerError;

      // Track support action
      await supabase.from('support_actions').insert({
        post_id: postId,
        user_id: user.id,
        action_type: 'volunteer',
        status: 'completed'
      });

      // Create notification for post author
      await supabase.from('notifications').insert({
        recipient_id: postAuthorId,
        type: 'volunteer_offer',
        title: 'New Volunteer Interest',
        message: message 
          ? `Someone offered to volunteer and said: "${message}"`
          : 'Someone offered to volunteer on your post',
        action_url: `/posts/${postId}`,
        priority: 'high'
      });

      toast({
        title: "Interest Submitted",
        description: "The post author has been notified of your interest to help."
      });

      return true;
    } catch (error: any) {
      console.error('Error creating volunteer interest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit volunteer interest",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createVolunteerInterest, isSubmitting };
};
