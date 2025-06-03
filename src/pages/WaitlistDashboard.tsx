
import React from 'react';
import { useWaitlist } from '@/hooks/useWaitlist';
import AdminWaitlistDashboard from '@/components/waitlist/AdminWaitlistDashboard';
import WaitlistPendingPage from '@/components/waitlist/WaitlistPendingPage';

const WaitlistDashboard = () => {
  const { isAdmin, userStatus, loading } = useWaitlist();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard if user is admin
  if (isAdmin) {
    return <AdminWaitlistDashboard />;
  }

  // Show pending page if user is not approved
  if (userStatus === 'pending' || userStatus === 'denied') {
    return <WaitlistPendingPage />;
  }

  // This shouldn't happen, but redirect to dashboard if approved
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default WaitlistDashboard;
