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
      navigate("/auth", { replace: true });
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
      navigate("/profile-registration", { replace: true });
      return;
    }

    // Check waitlist status
    if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
      hasRedirected.current = true;
      navigate("/waitlist", { replace: true });
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
  // Use opacity instead of conditional rendering to prevent layout shifts
  return (
    <>
      {/* Always render children for instant content display - no wrapper div to prevent layout shift */}
      <div 
        className={`transition-opacity duration-200 ${authVerified ? 'opacity-100' : 'opacity-95'}`}
        style={{ pointerEvents: authVerified ? 'auto' : 'none' }}
      >
        {children}
      </div>
      
      {/* Loading overlay - fade in/out smoothly without blur to reduce GPU load */}
      <div 
        className={`fixed inset-0 bg-background/60 z-50 flex items-center justify-center transition-all duration-200 ${
          (isLoading || (!authVerified && user)) 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    </>
  );
};

export default ProtectedRoute;
