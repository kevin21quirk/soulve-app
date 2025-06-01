
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PointTransaction, PointCategory } from '@/types/gamification';

export const useRealTimePoints = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentTransactions, setRecentTransactions] = useState<PointTransaction[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadInitialData();
  }, [user?.id]);

  const loadInitialData = async () => {
    if (!user?.id) return;

    try {
      // Load recent transactions
      const { data: activities, error: activitiesError } = await supabase
        .from('impact_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      // Convert to PointTransaction format
      const transactions: PointTransaction[] = (activities || []).map(activity => ({
        id: activity.id,
        userId: activity.user_id,
        category: activity.activity_type as PointCategory,
        points: activity.points_earned,
        multiplier: 1,
        basePoints: activity.points_earned,
        description: activity.description,
        timestamp: activity.created_at,
        verified: activity.verified,
        relatedEntityId: undefined,
        metadata: typeof activity.metadata === 'object' && activity.metadata !== null 
          ? activity.metadata as Record<string, any>
          : {}
      }));

      setRecentTransactions(transactions);

      // Calculate total points
      const totalPointsEarned = transactions
        .filter(t => t.verified)
        .reduce((sum, t) => sum + t.points, 0);
      
      setTotalPoints(totalPointsEarned);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load points data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
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
          
          // Create a transaction from the activity
          const transaction: PointTransaction = {
            id: newActivity.id,
            userId: newActivity.user_id,
            category: newActivity.activity_type as PointCategory,
            points: newActivity.points_earned,
            multiplier: 1,
            basePoints: newActivity.points_earned,
            description: newActivity.description,
            timestamp: newActivity.created_at,
            verified: newActivity.verified,
            relatedEntityId: undefined,
            metadata: typeof newActivity.metadata === 'object' && newActivity.metadata !== null 
              ? newActivity.metadata as Record<string, any>
              : {}
          };

          setRecentTransactions(prev => [transaction, ...prev.slice(0, 9)]);
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
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to earn points.",
        variant: "destructive"
      });
      return;
    }

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
    awardPoints,
    loading
  };
};
