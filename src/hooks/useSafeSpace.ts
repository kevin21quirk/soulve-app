
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSafeSpace = () => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [isHelper, setIsHelper] = useState(false);
  const [helperStatus, setHelperStatus] = useState<string>('');
  const [helperStats, setHelperStats] = useState<any>(null);
  const [queuePosition, setQueuePosition] = useState<number | undefined>(undefined);
  const [availableHelpers, setAvailableHelpers] = useState(0);
  const [isRequestingSupport, setIsRequestingSupport] = useState(false);

  useEffect(() => {
    checkUserStatus();
    fetchAvailableHelpers();
    checkActiveSession();
    checkQueuePosition();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: helper } = await supabase
        .from('safe_space_helpers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (helper) {
        setIsHelper(true);
        setHelperStatus(helper.verification_status);
        await fetchHelperStats(user.id);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const fetchHelperStats = async (userId: string) => {
    try {
      const { data: sessions } = await supabase
        .from('safe_space_sessions')
        .select('duration_minutes, feedback_rating')
        .eq('helper_id', userId)
        .eq('status', 'ended');

      const { data: activeSessions } = await supabase
        .from('safe_space_sessions')
        .select('id')
        .eq('helper_id', userId)
        .eq('status', 'active');

      if (sessions) {
        const totalSessions = sessions.length;
        const totalHours = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60;
        const averageRating = sessions
          .filter(s => s.feedback_rating)
          .reduce((sum, s, _, arr) => sum + s.feedback_rating / arr.length, 0);

        setHelperStats({
          totalSessions,
          totalHours: Math.round(totalHours),
          averageRating,
          activeSessions: activeSessions?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching helper stats:', error);
    }
  };

  const fetchAvailableHelpers = async () => {
    try {
      const { count } = await supabase
        .from('safe_space_helpers')
        .select('id', { count: 'exact' })
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .lt('current_sessions', 'max_concurrent_sessions');

      setAvailableHelpers(count || 0);
    } catch (error) {
      console.error('Error fetching available helpers:', error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: session } = await supabase
        .from('safe_space_sessions')
        .select('*')
        .or(`requester_id.eq.${user.id},helper_id.eq.${user.id}`)
        .eq('status', 'active')
        .single();

      if (session) {
        setCurrentSession(session);
      }
    } catch (error) {
      // No active session is expected in most cases
      console.log('No active session found');
    }
  };

  const checkQueuePosition = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: queueEntry } = await supabase
        .from('safe_space_queue')
        .select('position_in_queue')
        .eq('requester_id', user.id)
        .single();

      if (queueEntry) {
        setQueuePosition(queueEntry.position_in_queue);
      }
    } catch (error) {
      // No queue position is expected in most cases
      console.log('User not in queue');
    }
  };

  const requestSupport = async (issueCategory: string, urgencyLevel: string, additionalInfo: string) => {
    setIsRequestingSupport(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: sessionId, error } = await supabase.rpc('match_safe_space_helper', {
        p_requester_id: user.id,
        p_issue_category: issueCategory,
        p_urgency_level: urgencyLevel
      });

      if (error) throw error;

      if (sessionId) {
        // Matched immediately
        await checkActiveSession();
        toast({
          title: "Connected!",
          description: "You've been matched with a helper. Starting your session now.",
        });
      } else {
        // Added to queue
        await checkQueuePosition();
        toast({
          title: "Added to queue",
          description: "We're finding the right helper for you. You'll be notified when connected.",
        });
      }
    } catch (error) {
      console.error('Error requesting support:', error);
      throw error;
    } finally {
      setIsRequestingSupport(false);
    }
  };

  const updateHelperAvailability = async (isAvailable: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('safe_space_helpers')
        .update({ 
          is_available: isAvailable,
          last_active: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  };

  const updateHelperSpecializations = async (specializations: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('safe_space_helpers')
        .update({ specializations })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating specializations:', error);
      throw error;
    }
  };

  const startVerificationProcess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('safe_space_helpers')
        .insert({
          user_id: user.id,
          specializations: ['general'],
          verification_status: 'pending'
        });

      if (error) throw error;

      setIsHelper(true);
      setHelperStatus('pending');
    } catch (error) {
      console.error('Error starting verification:', error);
      throw error;
    }
  };

  return {
    currentSession,
    isHelper,
    helperStatus,
    helperStats,
    queuePosition,
    availableHelpers,
    isRequestingSupport,
    requestSupport,
    updateHelperAvailability,
    updateHelperSpecializations,
    startVerificationProcess
  };
};
