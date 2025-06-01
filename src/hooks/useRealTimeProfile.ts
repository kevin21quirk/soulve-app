
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export const useRealTimeProfile = (profileId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileUpdates, setProfileUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!profileId && !user?.id) return;

    const targetId = profileId || user?.id;
    
    // Subscribe to profile changes
    const profileChannel = supabase
      .channel(`profile-changes-${targetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${targetId}`
        },
        (payload) => {
          console.log('Profile updated:', payload);
          setProfileUpdates(prev => ({
            ...prev,
            [targetId]: payload.new || payload.old
          }));

          // Only show toast for other users' updates, not own updates
          if (payload.eventType === 'UPDATE' && targetId !== user?.id) {
            toast({
              title: "Profile Updated",
              description: "This user's profile has been updated.",
            });
          }
        }
      )
      .subscribe();

    // Subscribe to verification changes for trust score updates
    const verificationChannel = supabase
      .channel(`verifications-${targetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_verifications',
          filter: `user_id=eq.${targetId}`
        },
        (payload) => {
          console.log('Verification status changed:', payload);
          if (payload.eventType === 'UPDATE' && payload.new?.status === 'approved') {
            toast({
              title: "Verification Approved! 🎉",
              description: "Trust score has been updated.",
            });
          }
        }
      )
      .subscribe();

    // Subscribe to impact metrics changes
    const metricsChannel = supabase
      .channel(`metrics-${targetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_metrics',
          filter: `user_id=eq.${targetId}`
        },
        (payload) => {
          console.log('Impact metrics updated:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(verificationChannel);
      supabase.removeChannel(metricsChannel);
    };
  }, [profileId, user?.id, toast]);

  return {
    profileUpdates,
    clearUpdates: () => setProfileUpdates({})
  };
};
