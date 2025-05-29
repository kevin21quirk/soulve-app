
import { Achievement, PointTransaction, UserStats } from '@/types/gamification';

export interface ExtendedAchievement extends Achievement {
  category: 'helping' | 'social' | 'consistency' | 'leadership' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  seasonalBonus?: number;
  prerequisites?: string[];
}

export class EnhancedAchievementsService {
  private static achievements: ExtendedAchievement[] = [
    // Basic Helping Achievements
    {
      id: 'first_help',
      title: 'First Helper',
      description: 'Complete your first help request',
      icon: '🤝',
      rarity: 'common',
      points: 50,
      pointsReward: 50,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'helping',
      difficulty: 'easy'
    },
    {
      id: 'helping_streak_5',
      title: 'Helping Streak',
      description: 'Help 5 people in a row',
      icon: '🔥',
      rarity: 'rare',
      points: 150,
      pointsReward: 150,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: 'helping',
      difficulty: 'medium'
    },
    {
      id: 'emergency_hero',
      title: 'Emergency Hero',
      description: 'Complete 10 emergency help requests',
      icon: '🚨',
      rarity: 'epic',
      points: 500,
      pointsReward: 500,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      category: 'helping',
      difficulty: 'hard'
    },

    // Social Achievements
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Make 50 connections',
      icon: '🦋',
      rarity: 'rare',
      points: 200,
      pointsReward: 200,
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      category: 'social',
      difficulty: 'medium'
    },
    {
      id: 'conversation_starter',
      title: 'Conversation Starter',
      description: 'Start 25 conversations',
      icon: '💬',
      rarity: 'common',
      points: 100,
      pointsReward: 100,
      unlocked: false,
      progress: 0,
      maxProgress: 25,
      category: 'social',
      difficulty: 'easy'
    },
    {
      id: 'community_builder',
      title: 'Community Builder',
      description: 'Create 3 community groups',
      icon: '🏘️',
      rarity: 'epic',
      points: 400,
      pointsReward: 400,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      category: 'social',
      difficulty: 'hard'
    },

    // Consistency Achievements
    {
      id: 'daily_helper',
      title: 'Daily Helper',
      description: 'Help someone every day for 7 days',
      icon: '📅',
      rarity: 'rare',
      points: 300,
      pointsReward: 300,
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      category: 'consistency',
      difficulty: 'medium'
    },
    {
      id: 'monthly_champion',
      title: 'Monthly Champion',
      description: 'Be in top 10 for an entire month',
      icon: '🏆',
      rarity: 'legendary',
      points: 1000,
      pointsReward: 1000,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'consistency',
      difficulty: 'extreme'
    },

    // Leadership Achievements
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Guide 5 new users through their first help',
      icon: '👨‍🏫',
      rarity: 'epic',
      points: 600,
      pointsReward: 600,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: 'leadership',
      difficulty: 'hard'
    },
    {
      id: 'impact_leader',
      title: 'Impact Leader',
      description: 'Organize 10 community events',
      icon: '👑',
      rarity: 'legendary',
      points: 800,
      pointsReward: 800,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      category: 'leadership',
      difficulty: 'extreme'
    },

    // Special Achievements
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Help 10 people between 10PM-6AM',
      icon: '🦉',
      rarity: 'rare',
      points: 250,
      pointsReward: 250,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      category: 'special',
      difficulty: 'medium'
    },
    {
      id: 'global_helper',
      title: 'Global Helper',
      description: 'Help people from 5 different countries',
      icon: '🌍',
      rarity: 'epic',
      points: 500,
      pointsReward: 500,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: 'special',
      difficulty: 'hard'
    },
    {
      id: 'seasonal_champion',
      title: 'Seasonal Champion',
      description: 'Complete all seasonal challenges',
      icon: '🎪',
      rarity: 'legendary',
      points: 1500,
      pointsReward: 1500,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'special',
      difficulty: 'extreme',
      seasonalBonus: 2
    }
  ];

  static getAchievementsByCategory(category: ExtendedAchievement['category']): ExtendedAchievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  static getAchievementsByDifficulty(difficulty: ExtendedAchievement['difficulty']): ExtendedAchievement[] {
    return this.achievements.filter(a => a.difficulty === difficulty);
  }

  static getProgressiveAchievements(): ExtendedAchievement[] {
    return this.achievements.filter(a => a.prerequisites && a.prerequisites.length > 0);
  }

  static checkAchievements(userStats: UserStats, transactions: PointTransaction[]): ExtendedAchievement[] {
    const newlyUnlocked: ExtendedAchievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      // Check prerequisites
      if (achievement.prerequisites) {
        const prerequisitesMet = achievement.prerequisites.every(prereqId => 
          this.achievements.find(a => a.id === prereqId)?.unlocked
        );
        if (!prerequisitesMet) return;
      }

      // Update progress and check completion
      this.updateProgress(achievement, userStats, transactions);
      
      if (achievement.progress >= achievement.maxProgress) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  }

  private static updateProgress(achievement: ExtendedAchievement, userStats: UserStats, transactions: PointTransaction[]) {
    switch (achievement.id) {
      case 'first_help':
        achievement.progress = Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
        break;
      case 'helping_streak_5':
        achievement.progress = Math.min(
          transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
          achievement.maxProgress
        );
        break;
      case 'emergency_hero':
        achievement.progress = Math.min(
          transactions.filter(t => t.category === 'emergency_help').length,
          achievement.maxProgress
        );
        break;
      case 'social_butterfly':
        achievement.progress = Math.min(userStats.connectionsCount, achievement.maxProgress);
        break;
      case 'conversation_starter':
        achievement.progress = Math.min(userStats.postsCount, achievement.maxProgress);
        break;
      case 'daily_helper':
        // Check for consecutive days of helping
        const helpDates = transactions
          .filter(t => ['help_completed', 'emergency_help'].includes(t.category))
          .map(t => new Date(t.timestamp).toDateString())
          .filter((date, index, arr) => arr.indexOf(date) === index)
          .sort();
        
        let consecutiveDays = 0;
        let maxConsecutive = 0;
        
        for (let i = 1; i < helpDates.length; i++) {
          const prev = new Date(helpDates[i - 1]);
          const curr = new Date(helpDates[i]);
          const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            consecutiveDays++;
            maxConsecutive = Math.max(maxConsecutive, consecutiveDays + 1);
          } else {
            consecutiveDays = 0;
          }
        }
        
        achievement.progress = Math.min(maxConsecutive, achievement.maxProgress);
        break;
      default:
        // Default progress calculation
        achievement.progress = Math.min(userStats.totalPoints / 100, achievement.maxProgress);
    }
  }

  static getAllAchievements(): ExtendedAchievement[] {
    return [...this.achievements];
  }

  static getAchievementStats() {
    const total = this.achievements.length;
    const unlocked = this.achievements.filter(a => a.unlocked).length;
    const byCategory = {
      helping: this.achievements.filter(a => a.category === 'helping').length,
      social: this.achievements.filter(a => a.category === 'social').length,
      consistency: this.achievements.filter(a => a.category === 'consistency').length,
      leadership: this.achievements.filter(a => a.category === 'leadership').length,
      special: this.achievements.filter(a => a.category === 'special').length,
    };

    return { total, unlocked, byCategory };
  }
}
