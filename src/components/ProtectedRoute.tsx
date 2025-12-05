import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAccessCheck } from '@/hooks/useAuthCache';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, onboardingCompleted, waitlistStatus, isLoading } = useAuthAccessCheck();
  const [authVerified, setAuthVerified] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Prevent multiple redirects
    if (hasRedirected.current) return;

    // If no user, redirect to auth page
    if (!user) {
      hasRedirected.current = true;
      window.location.hash = "#/auth";
      return;
    }

    // If admin, allow access immediately
    if (isAdmin) {
      setAuthVerified(true);
      return;
    }

    // Check onboarding
    if (!onboardingCompleted) {
      hasRedirected.current = true;
      window.location.hash = "#/profile-registration";
      return;
    }

    // Check waitlist status
    if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
      hasRedirected.current = true;
      window.location.hash = "#/waitlist";
      return;
    }

    // All checks passed
    setAuthVerified(true);
  }, [user, isAdmin, onboardingCompleted, waitlistStatus, isLoading, navigate]);

  // Reset redirect flag when user changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [user?.id]);

  // SKELETON-FIRST RENDERING: Always show children with overlay during loading
  // This eliminates the blank screen and provides instant visual feedback
  return (
    <div className="relative">
      {/* Always render children for instant content display */}
      <div className={authVerified ? '' : 'pointer-events-none'}>
        {children}
      </div>
      
      {/* Loading overlay - only shows during initial auth check */}
      {(isLoading || (!authVerified && user)) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto"></div>
            </div>
            <p className="text-sm text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
