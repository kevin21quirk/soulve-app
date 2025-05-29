
import { PointTransaction, UserStats } from '@/types/gamification';

export interface TrendAnalysis {
  period: 'week' | 'month' | 'quarter' | 'year';
  trend: 'increasing' | 'decreasing' | 'stable';
  percentage: number;
  prediction: number;
  confidence: number;
}

export interface PredictionModel {
  nextWeekPoints: number;
  nextMonthPoints: number;
  trustLevelProjection: string;
  daysToNextLevel: number;
  confidence: number;
}

export interface BehaviorInsights {
  mostActiveTime: string;
  preferredHelpType: string;
  averageResponseTime: number;
  helpSuccessRate: number;
  socialEngagementScore: number;
}

export class AdvancedAnalyticsService {
  static analyzeTrends(transactions: PointTransaction[]): TrendAnalysis[] {
    const periods = ['week', 'month', 'quarter'] as const;
    
    return periods.map(period => {
      const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const currentPeriod = this.getPointsForPeriod(transactions, daysBack);
      const previousPeriod = this.getPointsForPeriod(transactions, daysBack * 2, daysBack);
      
      const change = currentPeriod - previousPeriod;
      const percentage = previousPeriod > 0 ? (change / previousPeriod) * 100 : 100;
      
      const trend: TrendAnalysis['trend'] = 
        Math.abs(percentage) < 5 ? 'stable' :
        percentage > 0 ? 'increasing' : 'decreasing';
      
      const prediction = this.predictNextPeriod(transactions, daysBack);
      
      return {
        period,
        trend,
        percentage: Math.abs(percentage),
        prediction,
        confidence: this.calculateConfidence(transactions, daysBack)
      };
    });
  }

  static generatePredictions(transactions: PointTransaction[], userStats: UserStats): PredictionModel {
    const weeklyAverage = this.getAveragePointsPerPeriod(transactions, 7);
    const monthlyAverage = this.getAveragePointsPerPeriod(transactions, 30);
    
    // Apply trend multiplier
    const recentTrend = this.getRecentTrendMultiplier(transactions);
    
    const nextWeekPoints = Math.round(weeklyAverage * recentTrend);
    const nextMonthPoints = Math.round(monthlyAverage * recentTrend);
    
    // Project trust level
    const pointsToNextLevel = this.getPointsToNextLevel(userStats);
    const daysToNextLevel = pointsToNextLevel > 0 ? 
      Math.ceil(pointsToNextLevel / (weeklyAverage / 7)) : 0;
    
    const trustLevelProjection = this.projectTrustLevel(userStats, nextMonthPoints);
    
    return {
      nextWeekPoints,
      nextMonthPoints,
      trustLevelProjection,
      daysToNextLevel,
      confidence: this.calculatePredictionConfidence(transactions)
    };
  }

  static analyzeBehavior(transactions: PointTransaction[], userStats: UserStats): BehaviorInsights {
    // Analyze most active time
    const hourCounts: Record<number, number> = {};
    transactions.forEach(t => {
      const hour = new Date(t.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '12';
    
    const mostActiveTime = this.formatTimeRange(parseInt(mostActiveHour));
    
    // Analyze preferred help type
    const categoryFrequency: Record<string, number> = {};
    transactions.forEach(t => {
      categoryFrequency[t.category] = (categoryFrequency[t.category] || 0) + 1;
    });
    
    const preferredHelpType = Object.entries(categoryFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'help_completed';
    
    // Calculate metrics
    const averageResponseTime = this.calculateAverageResponseTime(transactions);
    const helpSuccessRate = this.calculateSuccessRate(transactions);
    const socialEngagementScore = this.calculateSocialScore(userStats);
    
    return {
      mostActiveTime,
      preferredHelpType: this.formatHelpType(preferredHelpType),
      averageResponseTime,
      helpSuccessRate,
      socialEngagementScore
    };
  }

  private static getPointsForPeriod(transactions: PointTransaction[], daysBack: number, offset = 0): number {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - offset);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack);
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.timestamp);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .reduce((sum, t) => sum + t.points, 0);
  }

  private static getAveragePointsPerPeriod(transactions: PointTransaction[], days: number): number {
    const periods = Math.floor(transactions.length * days / 30); // Estimate periods
    if (periods === 0) return 0;
    
    const totalPoints = this.getPointsForPeriod(transactions, days * periods);
    return totalPoints / periods;
  }

  private static getRecentTrendMultiplier(transactions: PointTransaction[]): number {
    const recentPoints = this.getPointsForPeriod(transactions, 7);
    const previousPoints = this.getPointsForPeriod(transactions, 7, 7);
    
    if (previousPoints === 0) return 1;
    return Math.max(0.5, Math.min(2, recentPoints / previousPoints));
  }

  private static predictNextPeriod(transactions: PointTransaction[], daysBack: number): number {
    const average = this.getAveragePointsPerPeriod(transactions, daysBack);
    const trend = this.getRecentTrendMultiplier(transactions);
    return Math.round(average * trend);
  }

  private static calculateConfidence(transactions: PointTransaction[], daysBack: number): number {
    const dataPoints = transactions.filter(t => {
      const date = new Date(t.timestamp);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysBack);
      return date >= cutoff;
    }).length;
    
    // More data points = higher confidence
    return Math.min(95, Math.max(20, dataPoints * 10));
  }

  private static calculatePredictionConfidence(transactions: PointTransaction[]): number {
    const consistency = this.calculateConsistency(transactions);
    const dataVolume = Math.min(100, transactions.length * 2);
    return Math.round((consistency + dataVolume) / 2);
  }

  private static calculateConsistency(transactions: PointTransaction[]): number {
    const weeklyPoints = [];
    for (let i = 0; i < 4; i++) {
      weeklyPoints.push(this.getPointsForPeriod(transactions, 7, i * 7));
    }
    
    const average = weeklyPoints.reduce((a, b) => a + b, 0) / weeklyPoints.length;
    const variance = weeklyPoints.reduce((sum, points) => sum + Math.pow(points - average, 2), 0) / weeklyPoints.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - (standardDeviation / average) * 100);
  }

  private static getPointsToNextLevel(userStats: UserStats): number {
    const levelThresholds = [0, 100, 500, 1500, 3000];
    const currentLevel = levelThresholds.findIndex(threshold => userStats.totalPoints < threshold);
    
    if (currentLevel === -1) return 0; // Max level reached
    return levelThresholds[currentLevel] - userStats.totalPoints;
  }

  private static projectTrustLevel(userStats: UserStats, additionalPoints: number): string {
    const futurePoints = userStats.totalPoints + additionalPoints;
    
    if (futurePoints >= 3000) return 'impact_champion';
    if (futurePoints >= 1500) return 'community_leader';
    if (futurePoints >= 500) return 'trusted_helper';
    if (futurePoints >= 100) return 'verified_helper';
    return 'new_user';
  }

  private static formatTimeRange(hour: number): string {
    const ranges = {
      6: 'Early Morning (6-9 AM)',
      9: 'Morning (9-12 PM)',
      12: 'Afternoon (12-3 PM)',
      15: 'Late Afternoon (3-6 PM)',
      18: 'Evening (6-9 PM)',
      21: 'Night (9 PM-12 AM)',
      0: 'Late Night (12-6 AM)'
    };
    
    const timeSlot = Object.keys(ranges)
      .map(Number)
      .sort((a, b) => Math.abs(hour - a) - Math.abs(hour - b))[0];
    
    return ranges[timeSlot as keyof typeof ranges];
  }

  private static formatHelpType(category: string): string {
    const types: Record<string, string> = {
      'help_completed': 'General Help',
      'emergency_help': 'Emergency Assistance',
      'donation': 'Financial Support',
      'community_group_created': 'Community Building'
    };
    return types[category] || 'Community Support';
  }

  private static calculateAverageResponseTime(transactions: PointTransaction[]): number {
    // Mock calculation - in real implementation, would calculate from request to completion time
    return Math.random() * 4 + 1; // 1-5 hours
  }

  private static calculateSuccessRate(transactions: PointTransaction[]): number {
    const helpTransactions = transactions.filter(t => 
      ['help_completed', 'emergency_help'].includes(t.category)
    );
    // Mock calculation - in real implementation, would calculate completion rate
    return Math.round(85 + Math.random() * 10); // 85-95%
  }

  private static calculateSocialScore(userStats: UserStats): number {
    const connectionsScore = Math.min(50, userStats.connectionsCount);
    const postsScore = Math.min(30, userStats.postsCount * 2);
    const likesScore = Math.min(20, userStats.likesReceived / 5);
    
    return Math.round(connectionsScore + postsScore + likesScore);
  }
}
