import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAccessCheck } from '@/hooks/useAuthCache';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, onboardingCompleted, waitlistStatus, isLoading } = useAuthAccessCheck();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If no user, redirect to auth page
    if (!user) {
      navigate('/auth', { replace: true });
      setHasChecked(true);
      return;
    }

    // If admin, allow access immediately
    if (isAdmin) {
      setHasChecked(true);
      return;
    }

    // Check onboarding
    if (!onboardingCompleted) {
      navigate('/profile-registration', { replace: true });
      setHasChecked(true);
      return;
    }

    // Check waitlist status
    if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
      navigate('/waitlist', { replace: true });
      setHasChecked(true);
      return;
    }

    // All checks passed
    setHasChecked(true);
  }, [user, isAdmin, onboardingCompleted, waitlistStatus, isLoading, navigate]);

  // Show loading while checking
  if (isLoading || !hasChecked) {
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
  // Always render children if checks passed - redirect handles no-user case
  return <>{children}</>;
};

export default ProtectedRoute;
