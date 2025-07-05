import { supabase } from '@/integrations/supabase/client';

export interface OrganizationTeamMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  title?: string;
  permissions: Record<string, any>;
  invited_by?: string;
  invited_at?: string;
  joined_at: string;
  is_active: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    email?: string;
  };
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  title?: string;
  invited_by: string;
  invitation_token: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export class OrganizationManagementService {
  static async getTeamMembers(organizationId: string): Promise<OrganizationTeamMember[]> {
    const { data, error } = await supabase
      .from('organization_team_members')
      .select(`
        *,
        profiles!inner(first_name, last_name, avatar_url)
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(member => ({
      ...member,
      permissions: typeof member.permissions === 'string' 
        ? JSON.parse(member.permissions) 
        : member.permissions || {},
      profile: member.profiles ? {
        first_name: member.profiles.first_name || '',
        last_name: member.profiles.last_name || '',
        avatar_url: member.profiles.avatar_url
      } : undefined
    }));
  }

  static async inviteTeamMember(organizationId: string, email: string, role: string, title?: string) {
    const { data, error } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email,
        role,
        title,
        invited_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPendingInvitations(organizationId: string): Promise<OrganizationInvitation[]> {
    const { data, error } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async acceptInvitation(invitationToken: string) {
    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('invitation_token', invitationToken)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) throw new Error('Invalid invitation');

    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Not authenticated');

    // Add to team members
    const { error: memberError } = await supabase
      .from('organization_team_members')
      .insert({
        organization_id: invitation.organization_id,
        user_id: user.data.user.id,
        role: invitation.role,
        title: invitation.title,
        invited_by: invitation.invited_by
      });

    if (memberError) throw memberError;

    // Update invitation status
    const { error: updateError } = await supabase
      .from('organization_invitations')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    return invitation;
  }

  static async updateTeamMemberRole(memberId: string, role: string, title?: string) {
    const { data, error } = await supabase
      .from('organization_team_members')
      .update({ role, title })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeTeamMember(memberId: string) {
    const { error } = await supabase
      .from('organization_team_members')
      .update({ is_active: false })
      .eq('id', memberId);

    if (error) throw error;
  }
}
