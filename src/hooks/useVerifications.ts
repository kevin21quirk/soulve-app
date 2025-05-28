
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
      fetchVerifications();
      fetchTrustScore();
      fetchTrustHistory();
    }
  }, [user]);

  const fetchVerifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications",
        variant: "destructive"
      });
    }
  };

  const fetchTrustScore = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('calculate_trust_score', { user_uuid: user.id });

      if (error) throw error;
      setTrustScore(data || 0);
    } catch (error) {
      console.error('Error fetching trust score:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trust_score_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTrustHistory(data || []);
    } catch (error) {
      console.error('Error fetching trust history:', error);
    }
  };

  const requestVerification = async (verificationType: string, verificationData?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: verificationType,
          verification_data: verificationData
        });

      if (error) throw error;

      toast({
        title: "Verification Requested",
        description: `Your ${verificationType} verification request has been submitted.`
      });

      fetchVerifications();
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Error",
        description: "Failed to request verification",
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
      fetchVerifications();
      fetchTrustScore();
      fetchTrustHistory();
    }
  };
};
