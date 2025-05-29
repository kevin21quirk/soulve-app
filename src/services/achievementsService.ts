
import { Achievement, PointTransaction, UserStats } from '@/types/gamification';

export interface AchievementRule {
  id: string;
  checkCondition: (userStats: UserStats, transactions: PointTransaction[]) => boolean;
  achievement: Achievement;
}

export class AchievementsService {
  private static achievements: Achievement[] = [
    {
      id: 'first_help',
      title: 'First Helper',
      description: 'Complete your first help request',
      icon: '🤝',
      rarity: 'common',
      pointsReward: 50,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      unlockedAt: undefined
    },
    {
      id: 'helping_streak',
      title: 'Helping Streak',
      description: 'Help 5 people in a row',
      icon: '🔥',
      rarity: 'rare',
      pointsReward: 150,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      unlockedAt: undefined
    },
    {
      id: 'generous_donor',
      title: 'Generous Donor',
      description: 'Make 10 donations',
      icon: '💝',
      rarity: 'epic',
      pointsReward: 300,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      unlockedAt: undefined
    },
    {
      id: 'trust_builder',
      title: 'Trust Builder',
      description: 'Reach trust level 3',
      icon: '🏆',
      rarity: 'legendary',
      pointsReward: 500,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      unlockedAt: undefined
    },
    {
      id: 'community_champion',
      title: 'Community Champion',
      description: 'Earn 1000 total points',
      icon: '👑',
      rarity: 'legendary',
      pointsReward: 200,
      unlocked: false,
      progress: 0,
      maxProgress: 1000,
      unlockedAt: undefined
    }
  ];

  private static rules: AchievementRule[] = [
    {
      id: 'first_help',
      checkCondition: (userStats, transactions) => 
        transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length >= 1,
      achievement: this.achievements[0]
    },
    {
      id: 'helping_streak',
      checkCondition: (userStats, transactions) => 
        transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length >= 5,
      achievement: this.achievements[1]
    },
    {
      id: 'generous_donor',
      checkCondition: (userStats, transactions) => 
        transactions.filter(t => t.category === 'donation').length >= 10,
      achievement: this.achievements[2]
    },
    {
      id: 'trust_builder',
      checkCondition: (userStats) => userStats.level >= 3,
      achievement: this.achievements[3]
    },
    {
      id: 'community_champion',
      checkCondition: (userStats) => userStats.totalPoints >= 1000,
      achievement: this.achievements[4]
    }
  ];

  static checkAchievements(userStats: UserStats, transactions: PointTransaction[]): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.rules.forEach(rule => {
      const achievement = this.achievements.find(a => a.id === rule.id);
      if (!achievement || achievement.unlocked) return;

      // Update progress
      this.updateProgress(achievement, userStats, transactions);

      // Check if condition is met
      if (rule.checkCondition(userStats, transactions)) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        achievement.progress = achievement.maxProgress;
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  }

  private static updateProgress(achievement: Achievement, userStats: UserStats, transactions: PointTransaction[]) {
    switch (achievement.id) {
      case 'first_help':
        achievement.progress = Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
        break;
      case 'helping_streak':
        achievement.progress = Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
        break;
      case 'generous_donor':
        achievement.progress = Math.min(
          transactions.filter(t => t.category === 'donation').length,
          achievement.maxProgress
        );
        break;
      case 'trust_builder':
        achievement.progress = userStats.level;
        break;
      case 'community_champion':
        achievement.progress = Math.min(userStats.totalPoints, achievement.maxProgress);
        break;
    }
  }

  static getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  static getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  static getInProgressAchievements(): Achievement[] {
    return this.achievements.filter(a => !a.unlocked && a.progress > 0);
  }
}
