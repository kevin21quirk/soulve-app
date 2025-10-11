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
      console.log('🔍 Fetching organizations for user:', user.id);
      
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

      console.log('📊 Organizations query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching user organizations:', error);
        return;
      }

      const formattedOrgs = data
        .filter(item => {
          if (!item.organization) {
            console.warn('⚠️ Organization data missing for item:', item);
            return false;
          }
          return true;
        })
        .map(item => ({
          id: item.organization.id,
          name: item.organization.name,
          avatar_url: item.organization.avatar_url,
          organization_type: item.organization.organization_type,
          role: item.role,
        }));

      console.log('✅ Formatted organizations:', formattedOrgs);
      setOrganizations(formattedOrgs);
    } catch (error) {
      console.error('💥 Exception fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { organizations, loading, refetch: fetchUserOrganizations };
};
