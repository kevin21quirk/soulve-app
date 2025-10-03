import { supabase } from '@/integrations/supabase/client';

export class NotificationService {
  static async createHelpCompletionNotification(
    requestId: string,
    recipientId: string,
    type: 'help_completion_request' | 'help_approved' | 'help_rejected',
    metadata: Record<string, any>
  ): Promise<void> {
    const notificationData = this.getNotificationData(type, metadata);

    const { error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        sender_id: metadata.senderId,
        type,
        title: notificationData.title,
        message: notificationData.message,
        priority: notificationData.priority,
        action_url: notificationData.actionUrl,
        action_type: notificationData.actionType,
        metadata: {
          ...metadata,
          request_id: requestId
        }
      });

    if (error) throw error;
  }

  private static getNotificationData(
    type: string,
    metadata: Record<string, any>
  ): {
    title: string;
    message: string;
    priority: string;
    actionUrl?: string;
    actionType?: string;
  } {
    switch (type) {
      case 'help_completion_request':
        return {
          title: 'Help Completion Submitted',
          message: `${metadata.helperName} has marked your help request "${metadata.postTitle}" as complete`,
          priority: 'high',
          actionUrl: `/dashboard?tab=help-approvals`,
          actionType: 'accept'
        };

      case 'help_approved':
        return {
          title: 'Help Approved! 🎉',
          message: `${metadata.requesterName} approved your help and rated you ${metadata.rating} stars`,
          priority: 'normal',
          actionUrl: `/profile/${metadata.requesterId}`,
          actionType: 'view'
        };

      case 'help_rejected':
        return {
          title: 'Help Request Feedback',
          message: `${metadata.requesterName} provided feedback on your help submission`,
          priority: 'normal',
          actionUrl: `/dashboard?tab=help-history`,
          actionType: 'view'
        };

      default:
        return {
          title: 'Notification',
          message: 'You have a new notification',
          priority: 'normal'
        };
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
  }
}
