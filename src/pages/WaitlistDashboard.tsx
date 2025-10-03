
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaitlist } from '@/hooks/useWaitlist';
import WaitlistPendingPage from '@/components/waitlist/WaitlistPendingPage';

const WaitlistDashboard = () => {
  const { isAdmin, userStatus, loading } = useWaitlist();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect admins to the admin hub instead
    if (isAdmin && !loading) {
      navigate('/admin/waitlist', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show pending page if user is not approved
  if (userStatus === 'pending' || userStatus === 'denied') {
    return <WaitlistPendingPage />;
  }

  // This shouldn't happen, but redirect to dashboard if approved
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default WaitlistDashboard;
