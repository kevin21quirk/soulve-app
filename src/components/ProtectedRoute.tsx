
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

      // No user, redirect to auth
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }

      try {
        // Check waitlist status first
        const { data: profileData } = await supabase
          .from('profiles')
          .select('waitlist_status')
          .eq('id', user.id)
          .maybeSingle();

        const waitlistStatus = profileData?.waitlist_status;

        // If user is pending or denied, redirect to waitlist page
        if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
          navigate('/waitlist', { replace: true });
          return;
        }

        // Check if user has completed onboarding
        const { data: onboardingData } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const completed = !!onboardingData;
        
        if (!completed) {
          navigate('/profile-registration', { replace: true });
          return;
        }
      } catch (error) {
        // If error checking, allow access (fail open for better UX)
        console.error('Error checking access:', error);
      }

      setChecking(false);
    };

    checkAccess();
  }, [user, authLoading, navigate]);

  // Show loading while checking auth status
  if (authLoading || checking) {
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
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
