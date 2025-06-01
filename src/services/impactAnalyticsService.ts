import { supabase } from '@/integrations/supabase/client';

export interface UserImpactData {
  userId: string;
  totalHelpProvided: number;
  totalHelpReceived: number;
  volunteerHours: number;
  donationAmount: number;
  communitiesJoined: number;
  connectionsCount: number;
  responsesTime: number;
  trustScore: number;
  impactScore: number;
  rank: number;
  percentile: number;
}

export interface CommunityComparison {
  metric: string;
  userValue: number;
  communityAverage: number;
  communityMedian: number;
  userPercentile: number;
  trend: 'above' | 'below' | 'average';
}

export interface ImpactTrend {
  date: string;
  value: number;
  metric: string;
}

export interface ImpactGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  category: string;
  isActive: boolean;
}

// Helper function to safely parse metadata
const parseMetadata = (metadata: any): Record<string, any> => {
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata;
  }
  return {};
};

export class ImpactAnalyticsService {
  static async getUserImpactData(userId: string): Promise<UserImpactData> {
    try {
      // Get user's help activity
      const { data: helpProvided } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', userId)
        .eq('category', 'help_needed');

      const { data: helpReceived } = await supabase
        .from('post_interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('interaction_type', 'help_completed');

      // Get connections
      const { data: connections } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted');

      // Get user activities for volunteer hours and donations
      const { data: activities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId);

      // Calculate metrics with proper metadata parsing
      const volunteerHours = activities?.filter(a => a.activity_type === 'volunteer')
        .reduce((sum, a) => {
          const metadata = parseMetadata(a.metadata);
          return sum + (metadata.hours || 0);
        }, 0) || 0;

      const donationAmount = activities?.filter(a => a.activity_type === 'donation')
        .reduce((sum, a) => {
          const metadata = parseMetadata(a.metadata);
          return sum + (metadata.amount || 0);
        }, 0) || 0;

      // Calculate impact score
      const impactScore = this.calculateImpactScore({
        helpProvided: helpProvided?.length || 0,
        helpReceived: helpReceived?.length || 0,
        volunteerHours,
        donationAmount,
        connectionsCount: connections?.length || 0
      });

      // Get community rank
      const rank = await this.getUserRank(userId, impactScore);
      const percentile = await this.getUserPercentile(userId, impactScore);

      return {
        userId,
        totalHelpProvided: helpProvided?.length || 0,
        totalHelpReceived: helpReceived?.length || 0,
        volunteerHours,
        donationAmount,
        communitiesJoined: 0, // Will be calculated from groups
        connectionsCount: connections?.length || 0,
        responsesTime: 2.5, // Mock for now
        trustScore: 85, // Mock for now
        impactScore,
        rank,
        percentile
      };
    } catch (error) {
      console.error('Error fetching user impact data:', error);
      // Return mock data for development
      return this.getMockUserImpactData(userId);
    }
  }

  static async getCommunityComparisons(userId: string): Promise<CommunityComparison[]> {
    const userImpact = await this.getUserImpactData(userId);
    
    // Mock community averages for now
    const metrics = [
      {
        metric: 'Help Provided',
        userValue: userImpact.totalHelpProvided,
        communityAverage: 12.5,
        communityMedian: 8,
        userPercentile: 75,
        trend: userImpact.totalHelpProvided > 12.5 ? 'above' : 'below'
      },
      {
        metric: 'Volunteer Hours',
        userValue: userImpact.volunteerHours,
        communityAverage: 25.3,
        communityMedian: 18,
        userPercentile: 82,
        trend: userImpact.volunteerHours > 25.3 ? 'above' : 'below'
      },
      {
        metric: 'Response Time (hours)',
        userValue: userImpact.responsesTime,
        communityAverage: 4.2,
        communityMedian: 3.8,
        userPercentile: 88,
        trend: userImpact.responsesTime < 4.2 ? 'above' : 'below'
      },
      {
        metric: 'Trust Score',
        userValue: userImpact.trustScore,
        communityAverage: 76.5,
        communityMedian: 78,
        userPercentile: 91,
        trend: userImpact.trustScore > 76.5 ? 'above' : 'below'
      }
    ] as CommunityComparison[];

    return metrics;
  }

  static async getImpactTrends(userId: string, days: number = 30): Promise<ImpactTrend[]> {
    // Mock trend data for now
    const trends: ImpactTrend[] = [];
    const metrics = ['helpProvided', 'volunteerHours', 'trustScore', 'impactScore'];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      metrics.forEach(metric => {
        trends.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 50) + Math.floor(Math.random() * i / 2),
          metric
        });
      });
    }
    
    return trends;
  }

  static async getUserGoals(userId: string): Promise<ImpactGoal[]> {
    try {
      // For now, return mock goals. In production, these would be stored in database
      return [
        {
          id: '1',
          title: 'Help 25 People This Month',
          description: 'Complete help requests from 25 different community members',
          targetValue: 25,
          currentValue: 18,
          deadline: '2024-12-31',
          category: 'helping',
          isActive: true
        },
        {
          id: '2',
          title: 'Volunteer 40 Hours',
          description: 'Contribute 40 hours of volunteer work to community projects',
          targetValue: 40,
          currentValue: 28,
          deadline: '2024-12-31',
          category: 'volunteering',
          isActive: true
        },
        {
          id: '3',
          title: 'Reach Trust Score 90',
          description: 'Achieve a community trust score of 90%',
          targetValue: 90,
          currentValue: 85,
          deadline: '2024-12-31',
          category: 'trust',
          isActive: true
        }
      ];
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return [];
    }
  }

  static async createGoal(userId: string, goal: Omit<ImpactGoal, 'id'>): Promise<ImpactGoal> {
    // Mock implementation - in production, save to database
    const newGoal: ImpactGoal = {
      ...goal,
      id: Date.now().toString()
    };
    return newGoal;
  }

  static async updateGoalProgress(goalId: string, currentValue: number): Promise<void> {
    // Mock implementation - in production, update database
    console.log(`Updated goal ${goalId} progress to ${currentValue}`);
  }

  private static calculateImpactScore(metrics: {
    helpProvided: number;
    helpReceived: number;
    volunteerHours: number;
    donationAmount: number;
    connectionsCount: number;
  }): number {
    const {
      helpProvided,
      helpReceived,
      volunteerHours,
      donationAmount,
      connectionsCount
    } = metrics;

    // Weighted scoring algorithm
    const helpScore = helpProvided * 10;
    const volunteerScore = volunteerHours * 2;
    const donationScore = donationAmount * 0.1;
    const connectionScore = connectionsCount * 1;
    const receivedPenalty = helpReceived * -2; // Small penalty for receiving help

    const totalScore = helpScore + volunteerScore + donationScore + connectionScore + receivedPenalty;
    return Math.max(0, Math.min(1000, Math.round(totalScore)));
  }

  private static async getUserRank(userId: string, impactScore: number): Promise<number> {
    // Mock implementation - in production, query database for actual ranks
    return Math.floor(Math.random() * 100) + 1;
  }

  private static async getUserPercentile(userId: string, impactScore: number): Promise<number> {
    // Mock implementation - in production, calculate based on all users
    return Math.floor(Math.random() * 30) + 70; // 70-99th percentile
  }

  private static getMockUserImpactData(userId: string): UserImpactData {
    return {
      userId,
      totalHelpProvided: 23,
      totalHelpReceived: 5,
      volunteerHours: 35,
      donationAmount: 450,
      communitiesJoined: 3,
      connectionsCount: 67,
      responsesTime: 2.1,
      trustScore: 89,
      impactScore: 342,
      rank: 45,
      percentile: 85
    };
  }
}
