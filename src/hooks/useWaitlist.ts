
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WaitlistUser {
  id: string;
  first_name?: string;
  last_name?: string;
  waitlist_status: 'pending' | 'approved' | 'denied';
  waitlist_notes?: string;
  admin_notes?: string;
  approved_at?: string;
  created_at?: string;
}

export const useWaitlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Developer override - you should always be recognized as admin
  const isDeveloper = user?.id === 'f13567a6-7606-48ef-9333-dd661199eaf1';

  // Check if current user is admin
  const checkAdminStatus = async () => {
    if (!user) return false;
    
    // Developer override
    if (isDeveloper) return true;
    
    const { data } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    return !!data;
  };

  // Get current user's waitlist status
  const getUserStatus = async () => {
    if (!user) return null;
    
    // Developer override - always approved
    if (isDeveloper) return 'approved';
    
    const { data } = await supabase
      .from('profiles')
      .select('waitlist_status')
      .eq('id', user.id)
      .maybeSingle();
    
    return data?.waitlist_status || 'pending';
  };

  // Fetch waitlist users (admin only)
  const fetchWaitlistUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        waitlist_status,
        waitlist_notes,
        admin_notes,
        approved_at,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist users:', error);
      return;
    }

    setWaitlistUsers(data || []);
  };

  // Approve user
  const approveUser = async (userId: string, notes?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('approve_waitlist_user', {
        target_user_id: userId,
        approving_admin_id: user.id
      });

      if (error) throw error;

      // Update notes if provided
      if (notes) {
        await supabase
          .from('profiles')
          .update({ admin_notes: notes })
          .eq('id', userId);
      }

      toast({
        title: "User Approved",
        description: "User has been approved and can now access the dashboard.",
      });

      fetchWaitlistUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Deny user
  const denyUser = async (userId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          waitlist_status: 'denied',
          admin_notes: reason 
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User Denied",
        description: "User has been denied access.",
      });

      fetchWaitlistUsers();
    } catch (error) {
      console.error('Error denying user:', error);
      toast({
        title: "Error",
        description: "Failed to deny user. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Make user admin
  const makeAdmin = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('admin_roles')
        .insert({
          user_id: userId,
          role: 'admin',
          granted_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Admin Role Granted",
        description: "User has been granted admin privileges.",
      });
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin role. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if user can access dashboard
  const canAccessDashboard = async () => {
    if (!user) return false;
    
    // Developer override
    if (isDeveloper) return true;
    
    const { data, error } = await supabase.rpc('can_access_dashboard', {
      user_uuid: user.id
    });

    if (error) {
      console.error('Error checking dashboard access:', error);
      return false;
    }

    return data;
  };

  useEffect(() => {
    const initializeWaitlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const [adminStatus, status] = await Promise.all([
        checkAdminStatus(),
        getUserStatus()
      ]);

      setIsAdmin(adminStatus);
      setUserStatus(status);

      if (adminStatus) {
        await fetchWaitlistUsers();
      }

      setLoading(false);
    };

    initializeWaitlist();
  }, [user, isDeveloper]);

  return {
    waitlistUsers,
    userStatus,
    isAdmin,
    loading,
    approveUser,
    denyUser,
    makeAdmin,
    canAccessDashboard,
    fetchWaitlistUsers
  };
};
