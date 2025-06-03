
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWaitlist } from '@/hooks/useWaitlist';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { canAccessDashboard, isAdmin, userStatus, loading: waitlistLoading } = useWaitlist();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to be ready
      if (authLoading || waitlistLoading) return;

      // No user, redirect to auth
      if (!user) {
        console.log('No authenticated user, redirecting to auth');
        navigate('/auth', { replace: true });
        return;
      }

      // Check if user can access dashboard
      const hasAccess = await canAccessDashboard();
      
      if (hasAccess || isAdmin) {
        setAccessGranted(true);
      } else {
        // User is not approved, redirect to waitlist page
        console.log('User not approved for dashboard access, redirecting to waitlist');
        navigate('/waitlist', { replace: true });
        return;
      }

      setChecking(false);
    };

    checkAccess();
  }, [user, authLoading, waitlistLoading, navigate, canAccessDashboard, isAdmin]);

  // Show loading while checking auth and waitlist status
  if (authLoading || waitlistLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user || !accessGranted) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
