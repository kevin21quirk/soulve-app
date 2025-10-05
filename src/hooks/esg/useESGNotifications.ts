import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  to: string;
  type: 'contribution_submitted' | 'contribution_verified' | 'invitation_sent' | 'data_request';
  data: {
    recipientName: string;
    organizationName: string;
    contributionTitle?: string;
    verificationStatus?: string;
    verificationNotes?: string;
    invitationLink?: string;
    requestDetails?: string;
  };
}

export const useSendESGNotification = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationData: NotificationData) => {
      const { data, error } = await supabase.functions.invoke('send-esg-notification', {
        body: notificationData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      console.log('Notification sent successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to send notification:', error);
      toast({
        title: 'Notification Error',
        description: 'Failed to send email notification. The action was completed but the user may not have been notified.',
        variant: 'destructive',
      });
    },
  });
};
