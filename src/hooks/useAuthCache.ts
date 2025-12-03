import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Cached admin status check - 10 minute cache
export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase.rpc('is_admin', { user_uuid: user.id });
      return !!data;
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};

// Cached onboarding status check - 5 minute cache
export const useOnboardingStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { completed: false };
      const { data } = await supabase
        .from('questionnaire_responses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      return { completed: !!data };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Cached waitlist status check - 5 minute cache
export const useWaitlistStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['waitlist-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { status: null };
      const { data } = await supabase
        .from('profiles')
        .select('waitlist_status')
        .eq('id', user.id)
        .maybeSingle();
      return { status: data?.waitlist_status || null };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Combined auth check for ProtectedRoute - runs all checks in parallel
export const useAuthAccessCheck = () => {
  const { user, loading: authLoading } = useAuth();
  
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: onboarding, isLoading: onboardingLoading } = useOnboardingStatus();
  const { data: waitlist, isLoading: waitlistLoading } = useWaitlistStatus();
  
  const isLoading = authLoading || (!!user && (adminLoading || onboardingLoading || waitlistLoading));
  
  return {
    user,
    isAdmin: !!isAdmin,
    onboardingCompleted: onboarding?.completed ?? false,
    waitlistStatus: waitlist?.status,
    isLoading,
  };
};
