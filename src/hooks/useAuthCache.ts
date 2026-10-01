import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface MeStatus {
  is_admin?: boolean;
  onboarding_completed?: boolean;
  waitlist_status?: string | null;
}

// Shared fetch of /profiles/me — all three hooks below read the same cached
// response (same queryKey → single request, deduped by React Query).
const useMeStatus = () => {
  const { user, api } = useAuth();
  return useQuery({
    queryKey: ['me-status', user?.id],
    queryFn: async () => api!.get<MeStatus>('/profiles/me'),
    enabled: !!user?.id && !!api,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 500,
  });
};

export const useIsAdmin = () => {
  const q = useMeStatus();
  return { ...q, data: q.data?.is_admin === true };
};

export const useOnboardingStatus = () => {
  const q = useMeStatus();
  return { ...q, data: { completed: q.data?.onboarding_completed === true } };
};

export const useWaitlistStatus = () => {
  const q = useMeStatus();
  return { ...q, data: { status: q.data?.waitlist_status ?? null } };
};

// Combined auth check for ProtectedRoute - runs all checks in parallel
export const useAuthAccessCheck = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: adminLoading, isError: adminError } = useIsAdmin();
  const { data: onboarding, isLoading: onboardingLoading, isError: onboardingError } = useOnboardingStatus();
  const { data: waitlist, isLoading: waitlistLoading, isError: waitlistError } = useWaitlistStatus();

  // If any query errors, don't block loading - use defaults
  const hasErrors = adminError || onboardingError || waitlistError;
  const isLoading = authLoading || (!!user && !hasErrors && (adminLoading || onboardingLoading || waitlistLoading));

  return {
    user,
    isAdmin: !!isAdmin,
    onboardingCompleted: onboarding?.completed ?? false,
    waitlistStatus: waitlist?.status,
    isLoading,
  };
};
