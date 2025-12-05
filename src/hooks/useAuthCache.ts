import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Cached admin status check - 10 minute cache with error handling
export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      try {
        const { data, error } = await supabase.rpc('is_admin', { user_uuid: user.id });
        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }
        return !!data;
      } catch (err) {
        console.error('Failed to check admin status:', err);
        return false;
      }
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    retryDelay: 500,
  });
};

// Cached onboarding status check - 5 minute cache
export const useOnboardingStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { completed: false };
      try {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) {
          console.error('Error checking onboarding status:', error);
          return { completed: false };
        }
        return { completed: !!data };
      } catch (err) {
        console.error('Failed to check onboarding status:', err);
        return { completed: false };
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 500,
  });
};

// Cached waitlist status check - 5 minute cache
export const useWaitlistStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['waitlist-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { status: null };
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('waitlist_status')
          .eq('id', user.id)
          .maybeSingle();
        if (error) {
          console.error('Error checking waitlist status:', error);
          return { status: null };
        }
        return { status: data?.waitlist_status || null };
      } catch (err) {
        console.error('Failed to check waitlist status:', err);
        return { status: null };
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 500,
  });
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
