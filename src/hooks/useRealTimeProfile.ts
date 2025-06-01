
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeProfile = (profileId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileUpdates, setProfileUpdates] = useState<Record<string, any>>({});
  const debounceRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<Record<string, any>>({});

  const debouncedProfileUpdate = useCallback((targetId: string, newData: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      // Check if data actually changed
      const lastData = lastUpdateRef.current[targetId];
      if (JSON.stringify(lastData) !== JSON.stringify(newData)) {
        setProfileUpdates(prev => ({
          ...prev,
          [targetId]: newData
        }));
        lastUpdateRef.current[targetId] = newData;
      }
    }, 300); // 300ms debounce
  }, []);

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
          const newData = payload.new || payload.old;
          
          if (newData) {
            debouncedProfileUpdate(targetId, newData);
            
            // Only show toast for other users' updates, not own updates
            if (payload.eventType === 'UPDATE' && targetId !== user?.id) {
              toast({
                title: "Profile Updated",
                description: "This user's profile has been updated.",
              });
            }
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(verificationChannel);
      supabase.removeChannel(metricsChannel);
    };
  }, [profileId, user?.id, toast, debouncedProfileUpdate]);

  const clearUpdates = useCallback(() => {
    setProfileUpdates({});
    lastUpdateRef.current = {};
  }, []);

  return {
    profileUpdates,
    clearUpdates
  };
};
