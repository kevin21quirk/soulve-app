import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) return;

      // No user, redirect to auth
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }

      try {
        // Server-side admin verification using RLS
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/dashboard', { replace: true });
          return;
        }

        if (!data) {
          // Not an admin, redirect to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }

        setIsAdmin(true);
        setChecking(false);
      } catch (error) {
        console.error('Error in admin check:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    checkAdminAccess();
  }, [user, authLoading, navigate]);

  // Show loading while checking
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
