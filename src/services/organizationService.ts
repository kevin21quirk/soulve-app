
import { supabase } from '@/integrations/supabase/client';
import { OrganizationConnection } from '@/components/dashboard/UserProfileTypes';

export const fetchUserOrganizations = async (userId: string): Promise<OrganizationConnection[]> => {
  try {
    const { data: organizations, error } = await supabase
      .rpc('get_user_organizations', { target_user_id: userId });

    if (error) {
      console.error('Error fetching user organizations:', error);
      return [];
    }

    return organizations?.map((org: any) => ({
      id: `${userId}-${org.organization_id}`,
      organizationId: org.organization_id,
      organizationName: org.organization_name,
      role: org.role,
      title: org.title,
      isCurrent: org.is_current,
      isPublic: true
    })) || [];
  } catch (error) {
    console.error('Error in fetchUserOrganizations:', error);
    return [];
  }
};

export const searchOrganizations = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, organization_type, location, avatar_url')
      .ilike('name', `%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching organizations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchOrganizations:', error);
    return [];
  }
};

export const joinOrganization = async (organizationId: string, role: string, title?: string) => {
  try {
    const { error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        role,
        title,
        is_public: true,
        is_active: true
      });

    if (error) {
      console.error('Error joining organization:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in joinOrganization:', error);
    throw error;
  }
};
