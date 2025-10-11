import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserOrganization {
  id: string;
  name: string;
  avatar_url: string | null;
  organization_type: string;
  role: string;
}

export const useUserOrganizations = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserOrganizations();
    }
  }, [user]);

  const fetchUserOrganizations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          organization:organizations (
            id,
            name,
            avatar_url,
            organization_type
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .in('role', ['owner', 'admin'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user organizations:', error);
        return;
      }

      const formattedOrgs = data
        .filter(item => item.organization)
        .map(item => ({
          id: item.organization.id,
          name: item.organization.name,
          avatar_url: item.organization.avatar_url,
          organization_type: item.organization.organization_type,
          role: item.role,
        }));

      setOrganizations(formattedOrgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { organizations, loading, refetch: fetchUserOrganizations };
};
