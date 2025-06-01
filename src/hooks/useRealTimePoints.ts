
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PointTransaction } from '@/types/gamification';

export const useRealTimePoints = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentTransactions, setRecentTransactions] = useState<PointTransaction[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to real-time changes in impact_activities table
    const channel = supabase
      .channel('points-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'impact_activities',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newActivity = payload.new;
          
          // Create a mock transaction from the activity
          const transaction: PointTransaction = {
            id: newActivity.id,
            userId: newActivity.user_id,
            category: newActivity.activity_type as any,
            points: newActivity.points_earned,
            multiplier: 1,
            basePoints: newActivity.points_earned,
            description: newActivity.description,
            timestamp: newActivity.created_at,
            verified: newActivity.verified,
            metadata: newActivity.metadata
          };

          setRecentTransactions(prev => [transaction, ...prev.slice(0, 4)]);
          setTotalPoints(prev => prev + newActivity.points_earned);

          // Show toast notification
          toast({
            title: "Points Earned! 🎉",
            description: `+${newActivity.points_earned} points: ${newActivity.description}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const awardPoints = async (
    category: string,
    points: number,
    description: string,
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('impact_activities')
        .insert({
          user_id: user.id,
          activity_type: category,
          points_earned: points,
          description,
          metadata: metadata || {},
          verified: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: "Failed to award points. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    recentTransactions,
    totalPoints,
    awardPoints
  };
};
