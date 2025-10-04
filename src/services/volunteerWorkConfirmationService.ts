import { supabase } from '@/integrations/supabase/client';

export interface VolunteerWorkActivity {
  id: string;
  user_id: string;
  activity_type: string;
  points_earned: number;
  description: string;
  hours_contributed: number;
  market_value_gbp: number;
  organization_id?: string;
  post_id?: string;
  confirmation_status: string;
  confirmed_by?: string;
  confirmed_at?: string;
  rejection_reason?: string;
  confirmation_requested_at?: string;
  verified: boolean;
  created_at: string;
  metadata?: any;
}

export interface VolunteerWorkNotification {
  id: string;
  activity_id: string;
  recipient_id: string;
  volunteer_id: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export class VolunteerWorkConfirmationService {
  static async getPendingConfirmations(userId: string): Promise<VolunteerWorkActivity[]> {
    const { data, error } = await supabase
      .from('impact_activities')
      .select('*')
      .eq('activity_type', 'volunteer_work')
      .eq('confirmation_status', 'pending')
      .or(`organization_id.in.(${await this.getUserOrganizationIds(userId)}),post_id.in.(${await this.getUserPostIds(userId)})`);

    if (error) throw error;
    return data || [];
  }

  static async getMySubmissions(userId: string): Promise<VolunteerWorkActivity[]> {
    const { data, error } = await supabase
      .from('impact_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', 'volunteer_work')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async confirmVolunteerWork(activityId: string): Promise<any> {
    const { data, error } = await supabase.rpc('confirm_volunteer_work', {
      activity_id: activityId,
      confirm_status: 'confirmed'
    });

    if (error) throw error;
    return data;
  }

  static async rejectVolunteerWork(activityId: string, reason: string): Promise<any> {
    const { data, error } = await supabase.rpc('confirm_volunteer_work', {
      activity_id: activityId,
      confirm_status: 'rejected',
      rejection_note: reason
    });

    if (error) throw error;
    return data;
  }

  static async getNotifications(userId: string): Promise<VolunteerWorkNotification[]> {
    const { data, error } = await supabase
      .from('volunteer_work_notifications')
      .select('*')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('volunteer_work_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  private static async getUserOrganizationIds(userId: string): Promise<string> {
    const { data } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId)
      .eq('is_active', true);

    return data?.map(m => m.organization_id).join(',') || '';
  }

  private static async getUserPostIds(userId: string): Promise<string> {
    const { data } = await supabase
      .from('posts')
      .select('id')
      .eq('author_id', userId);

    return data?.map(p => p.id).join(',') || '';
  }
}
