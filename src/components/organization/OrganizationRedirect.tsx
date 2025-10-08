import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';

/**
 * Redirect component for old /organization/:id routes
 * Redirects to new dashboard-based organization profiles
 */
const OrganizationRedirect = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (organizationId) {
      navigate(`/dashboard?context=org&orgId=${organizationId}&tab=profile`, { replace: true });
    }
  }, [organizationId, navigate]);

  return <LoadingState message="Loading organization profile..." />;
};

export default OrganizationRedirect;
