
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserVerification, TrustScoreHistoryEntry } from '@/types/verification';
import { useToast } from '@/hooks/use-toast';

export const useVerifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [trustScore, setTrustScore] = useState<number>(0);
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

  const fetchVerifications = async () => {
    if (!user) return;

    try {
      console.log('Fetching verifications for user:', user.id);
      
      // Use type assertion to work around missing table types
      const { data, error } = await (supabase as any)
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Verifications response:', { data, error });

      if (error) {
        console.error('Error fetching verifications:', error);
        throw error;
      }
      
      setVerifications(data || []);
    } catch (error) {
      console.error('Error in fetchVerifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications. The verification system may not be fully set up yet.",
        variant: "destructive"
      });
      // Set empty array on error to prevent crashes
      setVerifications([]);
    }
  };

  const fetchTrustScore = async () => {
    if (!user) return;

    try {
      console.log('Calculating trust score for user:', user.id);
      
      const { data, error } = await (supabase as any)
        .rpc('calculate_trust_score', { user_uuid: user.id });

      console.log('Trust score response:', { data, error });

      if (error) {
        console.error('Error calculating trust score:', error);
        throw error;
      }
      
      setTrustScore(data || 50); // Default score of 50 if no data
    } catch (error) {
      console.error('Error in fetchTrustScore:', error);
      // Set default trust score on error
      setTrustScore(50);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustHistory = async () => {
    if (!user) return;

    try {
      console.log('Fetching trust history for user:', user.id);
      
      const { data, error } = await (supabase as any)
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
      // Set empty array on error
      setTrustHistory([]);
    }
  };

  const requestVerification = async (verificationType: string, verificationData?: any) => {
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
      
      const { error } = await (supabase as any)
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
