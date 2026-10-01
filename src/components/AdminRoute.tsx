import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, api, loading: authLoading } = useAuth();
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
        // Server-side admin verification via the Neon API
        if (!api) {
          navigate('/dashboard', { replace: true });
          return;
        }
        const me = await api.get<{ is_admin?: boolean }>('/profiles/me');

        if (me.is_admin !== true) {
          console.log('User is not an admin, redirecting to dashboard');
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
  }, [user, api, authLoading, navigate]);

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

  // Always render children - redirect handles non-admin case
  return <>{children}</>;
};

export default AdminRoute;
