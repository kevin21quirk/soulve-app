
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserVerification, TrustScoreHistoryEntry, VerificationType, VerificationStatus } from '@/types/verification';
import { useToast } from '@/hooks/use-toast';

export const useVerifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [trustScore, setTrustScore] = useState<number>(50);
  const [trustHistory, setTrustHistory] = useState<TrustScoreHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log('User found, fetching verification data for:', user.id);
      fetchVerifications();
      fetchTrustScore();
      fetchTrustHistory();
    } else {
      console.log('No user found');
      setLoading(false);
    }
  }, [user]);

  // Real-time subscription for verification updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-verifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_verifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Verification update:', payload);
          // Refetch all data when verifications change
          fetchVerifications();
          fetchTrustScore();
          fetchTrustHistory();
          
          // Show toast notification
          if (payload.eventType === 'UPDATE' && payload.new.status === 'approved') {
            toast({
              title: "Verification Approved! 🎉",
              description: `Your ${payload.new.verification_type} verification has been approved.`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchVerifications = async () => {
    if (!user) return;

    try {
      console.log('Fetching verifications for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Verifications response:', { data, error });

      if (error) {
        console.error('Error fetching verifications:', error);
        throw error;
      }
      
      // Transform the data to match our interface types
      const transformedData: UserVerification[] = (data || []).map(item => ({
        ...item,
        verification_type: item.verification_type as VerificationType,
        status: item.status as VerificationStatus,
        expires_at: item.expires_at || undefined,
        verified_at: item.verified_at || undefined,
        verified_by: item.verified_by || undefined,
        notes: item.notes || undefined,
        verification_data: item.verification_data || undefined
      }));
      
      setVerifications(transformedData);
    } catch (error) {
      console.error('Error in fetchVerifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications.",
        variant: "destructive"
      });
      setVerifications([]);
    }
  };

  const fetchTrustScore = async () => {
    if (!user) return;

    try {
      console.log('Calculating trust score for user:', user.id);
      
      const { data, error } = await supabase
        .rpc('calculate_trust_score', { user_uuid: user.id });

      console.log('Trust score response:', { data, error });

      if (error) {
        console.error('Error calculating trust score:', error);
        throw error;
      }
      
      setTrustScore(data || 50);
    } catch (error) {
      console.error('Error in fetchTrustScore:', error);
      setTrustScore(50);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustHistory = async () => {
    if (!user) return;

    try {
      console.log('Fetching trust history for user:', user.id);
      
      const { data, error } = await supabase
        .from('trust_score_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Trust history response:', { data, error });

      if (error) {
        console.error('Error fetching trust history:', error);
        throw error;
      }
      
      setTrustHistory(data || []);
    } catch (error) {
      console.error('Error in fetchTrustHistory:', error);
      setTrustHistory([]);
    }
  };

  const requestVerification = async (verificationType: VerificationType, verificationData?: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request verification.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Requesting verification:', { verificationType, userId: user.id });
      
      const { error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: verificationType,
          verification_data: verificationData
        });

      console.log('Verification request response:', { error });

      if (error) {
        console.error('Error requesting verification:', error);
        throw error;
      }

      toast({
        title: "Verification Requested",
        description: `Your ${verificationType} verification request has been submitted.`
      });

      // Refresh verifications
      fetchVerifications();
    } catch (error) {
      console.error('Error in requestVerification:', error);
      toast({
        title: "Error",
        description: "Failed to request verification. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    verifications,
    trustScore,
    trustHistory,
    loading,
    requestVerification,
    refetch: () => {
      console.log('Refetching all verification data');
      fetchVerifications();
      fetchTrustScore();
      fetchTrustHistory();
    }
  };
};
