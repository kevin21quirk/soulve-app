
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserVerification, TrustScoreHistoryEntry, VerificationType, VerificationStatus } from '@/types/verification';
import { useToast } from '@/hooks/use-toast';

interface VerificationsMeResponse {
  verifications: UserVerification[];
  trustScore: number;
  trustHistory: TrustScoreHistoryEntry[];
}

export const useVerifications = () => {
  const { user, api } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [trustScore, setTrustScore] = useState<number>(0);
  const [trustHistory, setTrustHistory] = useState<TrustScoreHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id || !api) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get<VerificationsMeResponse>('/verifications/me');

      const transformed: UserVerification[] = (data.verifications || []).map(item => ({
        ...item,
        verification_type: item.verification_type as VerificationType,
        status: item.status as VerificationStatus,
        expires_at: item.expires_at || undefined,
        verified_at: item.verified_at || undefined,
        verified_by: item.verified_by || undefined,
        notes: item.notes || undefined,
        verification_data: item.verification_data || undefined
      }));

      setVerifications(transformed);
      setTrustScore(data.trustScore ?? 0);
      setTrustHistory(data.trustHistory || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications.",
        variant: "destructive"
      });
      setVerifications([]);
      setTrustScore(0);
      setTrustHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, api, toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const requestVerification = async (verificationType: VerificationType, verificationData?: any) => {
    if (!user || !api) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request verification.",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.post('/verifications/me', {
        verification_type: verificationType,
        verification_data: verificationData,
      });

      if (verificationType === 'email') {
        toast({
          title: "Email Verified! ✓",
          description: "Your email has been automatically verified."
        });
      } else {
        toast({
          title: "Verification Requested",
          description: `Your ${verificationType} verification request has been submitted.`
        });
      }

      fetchAll();
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
    refetch: fetchAll,
  };
};
