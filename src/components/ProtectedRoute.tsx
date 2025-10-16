
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to be ready
      if (authLoading) return;

      setChecking(true);

      // If no user, redirect to auth page
      if (!user) {
        navigate('/auth', { replace: true });
        setChecking(false);
        return;
      }

      try {
        // Check if user is an admin - admins bypass all checks
        const { data: adminRole } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        const isAdmin = !!adminRole;

        // If admin, allow access
        if (isAdmin) {
          setChecking(false);
          return;
        }

        // Check if user has completed the questionnaire
        const { data: questionnaireData } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!questionnaireData) {
          // User hasn't completed onboarding
          navigate('/profile-registration', { replace: true });
          return;
        }

        // For non-admin users who completed questionnaire, check waitlist status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('waitlist_status')
          .eq('id', user.id)
          .maybeSingle();
        
        const waitlistStatus = profileData?.waitlist_status;
        
        if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
          // User is not approved, redirect to waitlist
          navigate('/waitlist', { replace: true });
          return;
        }

        // User has completed onboarding and is approved, allow access
        setChecking(false);
      } catch (error) {
        console.error('Error checking access:', error);
        // On error, still allow access but log it
        setChecking(false);
      }
    };

    checkAccess();
  }, [user, navigate, authLoading]);

  // Show loading while checking auth status
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-primary/20 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Verifying access...</p>
            <p className="text-xs text-muted-foreground">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
