
import { useState, useEffect } from 'react';
import { UserStats, PointTransaction, Achievement } from '@/types/gamification';
import { PointsCalculator } from '@/services/pointsService';
import { AchievementsService } from '@/services/achievementsService';
import { realTimePointsService } from '@/services/realTimePointsService';

export const useProgressTracking = (userStats: UserStats, transactions: PointTransaction[]) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentPointsEarned, setRecentPointsEarned] = useState<PointTransaction[]>([]);
  const [progressAnimations, setProgressAnimations] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize achievements
    const allAchievements = AchievementsService.getAchievements();
    const updatedAchievements = allAchievements.map(achievement => {
      const progress = calculateAchievementProgress(achievement, userStats, transactions);
      return { ...achievement, progress };
    });
    setAchievements(updatedAchievements);

    // Check for newly unlocked achievements
    const newlyUnlocked = AchievementsService.checkAchievements(userStats, transactions);
    if (newlyUnlocked.length > 0) {
      // Trigger achievement unlock animations
      newlyUnlocked.forEach(achievement => {
        console.log(`🎉 Achievement unlocked: ${achievement.title}`);
      });
    }
  }, [userStats, transactions]);

  useEffect(() => {
    // Listen for real-time points
    const unsubscribe = realTimePointsService.addListener((transaction) => {
      setRecentPointsEarned(prev => [transaction, ...prev.slice(0, 4)]);
      
      // Trigger progress animation
      setProgressAnimations(prev => ({
        ...prev,
        [transaction.category]: (prev[transaction.category] || 0) + transaction.points
      }));

      // Clear animation after delay
      setTimeout(() => {
        setProgressAnimations(prev => {
          const newAnimations = { ...prev };
          delete newAnimations[transaction.category];
          return newAnimations;
        });
      }, 3000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const calculateAchievementProgress = (
    achievement: Achievement, 
    userStats: UserStats, 
    transactions: PointTransaction[]
  ): number => {
    switch (achievement.id) {
      case 'first_help':
        return Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
      case 'helping_streak':
        return Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
      case 'generous_donor':
        return Math.min(
          transactions.filter(t => t.category === 'donation').length,
          achievement.maxProgress
        );
      case 'trust_builder':
        return userStats.level;
      case 'community_champion':
        return Math.min(userStats.totalPoints, achievement.maxProgress);
      default:
        return achievement.progress;
    }
  };

  const getNextLevelProgress = () => {
    const nextLevel = PointsCalculator.getNextTrustLevel(userStats.totalPoints);
    if (!nextLevel) return { percentage: 100, pointsNeeded: 0 };
    
    const currentLevelPoints = userStats.totalPoints;
    const nextLevelPoints = userStats.totalPoints + nextLevel.pointsNeeded;
    const previousLevelPoints = currentLevelPoints - (nextLevelPoints - currentLevelPoints);
    
    const progress = (currentLevelPoints - previousLevelPoints) / (nextLevelPoints - previousLevelPoints);
    return {
      percentage: Math.min(progress * 100, 100),
      pointsNeeded: nextLevel.pointsNeeded
    };
  };

  const getWeeklyProgress = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyTransactions = transactions.filter(t => 
      new Date(t.timestamp) >= oneWeekAgo
    );
    
    const weeklyPoints = weeklyTransactions.reduce((sum, t) => sum + t.points, 0);
    const weeklyGoal = 200; // Weekly target
    
    return {
      points: weeklyPoints,
      goal: weeklyGoal,
      percentage: Math.min((weeklyPoints / weeklyGoal) * 100, 100),
      transactionCount: weeklyTransactions.length
    };
  };

  return {
    achievements,
    recentPointsEarned,
    progressAnimations,
    nextLevelProgress: getNextLevelProgress(),
    weeklyProgress: getWeeklyProgress(),
    unlockedAchievements: achievements.filter(a => a.unlocked),
    inProgressAchievements: achievements.filter(a => !a.unlocked && a.progress > 0)
  };
};
