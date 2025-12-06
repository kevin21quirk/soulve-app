
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

export interface ImpactActivity {
  id: string;
  activityType: string;
  pointsEarned: number;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  verified: boolean;
}

export class ImpactAnalyticsService {
  static async getUserImpactData(userId: string): Promise<UserImpactData> {
    try {
      // Get or create user metrics
      let { data: metrics } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!metrics) {
        // Calculate metrics for first time
        await this.calculateUserMetrics(userId);
        
        const { data: newMetrics } = await supabase
          .from('impact_metrics')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        metrics = newMetrics;
      }

      if (!metrics) {
        return this.getMockUserImpactData(userId);
      }

      // Get community rank and percentile
      const { rank, percentile } = await this.getUserRankAndPercentile(userId, metrics.impact_score);

      // Get groups count for communities joined
      const { data: userGroups } = await supabase
        .from('group_members')
        .select('*')
        .eq('user_id', userId);

      return {
        userId,
        totalHelpProvided: metrics.help_provided_count || 0,
        totalHelpReceived: metrics.help_received_count || 0,
        volunteerHours: metrics.volunteer_hours || 0,
        donationAmount: Number(metrics.donation_amount) || 0,
        communitiesJoined: userGroups?.length || 0,
        connectionsCount: metrics.connections_count || 0,
        responsesTime: Number(metrics.response_time_hours) || 2.5,
        trustScore: metrics.trust_score ?? 0,
        impactScore: metrics.impact_score || 0,
        rank,
        percentile
      };
    } catch (error) {
      console.error('Error fetching user impact data:', error);
      return this.getMockUserImpactData(userId);
    }
  }

  static async calculateUserMetrics(userId: string): Promise<void> {
    try {
      await supabase.rpc('calculate_user_impact_metrics', {
        target_user_id: userId
      });
    } catch (error) {
      console.error('Error calculating user metrics:', error);
    }
  }

  static async getUserRankAndPercentile(userId: string, userScore: number): Promise<{ rank: number; percentile: number }> {
    try {
      // Get all users with impact scores
      const { data: allMetrics } = await supabase
        .from('impact_metrics')
        .select('user_id, impact_score')
        .order('impact_score', { ascending: false });

      if (!allMetrics || allMetrics.length === 0) {
        return { rank: 1, percentile: 100 };
      }

      const userIndex = allMetrics.findIndex(m => m.user_id === userId);
      const rank = userIndex >= 0 ? userIndex + 1 : allMetrics.length;
      const percentile = Math.round(((allMetrics.length - rank + 1) / allMetrics.length) * 100);

      return { rank, percentile };
    } catch (error) {
      console.error('Error calculating rank and percentile:', error);
      return { rank: Math.floor(Math.random() * 100) + 1, percentile: Math.floor(Math.random() * 30) + 70 };
    }
  }

  static async getCommunityComparisons(userId: string): Promise<CommunityComparison[]> {
    try {
      const userImpact = await this.getUserImpactData(userId);
      
      // Get community averages from all users
      const { data: allMetrics } = await supabase
        .from('impact_metrics')
        .select('*');

      if (!allMetrics || allMetrics.length === 0) {
        return this.getMockCommunityComparisons(userImpact);
      }

      const metrics = [
        {
          metric: 'Help Provided',
          userValue: userImpact.totalHelpProvided,
          communityAverage: this.calculateAverage(allMetrics.map(m => m.help_provided_count)),
          communityMedian: this.calculateMedian(allMetrics.map(m => m.help_provided_count)),
          userPercentile: this.calculatePercentile(allMetrics.map(m => m.help_provided_count), userImpact.totalHelpProvided),
          trend: userImpact.totalHelpProvided > this.calculateAverage(allMetrics.map(m => m.help_provided_count)) ? 'above' : 'below'
        },
        {
          metric: 'Volunteer Hours',
          userValue: userImpact.volunteerHours,
          communityAverage: this.calculateAverage(allMetrics.map(m => m.volunteer_hours)),
          communityMedian: this.calculateMedian(allMetrics.map(m => m.volunteer_hours)),
          userPercentile: this.calculatePercentile(allMetrics.map(m => m.volunteer_hours), userImpact.volunteerHours),
          trend: userImpact.volunteerHours > this.calculateAverage(allMetrics.map(m => m.volunteer_hours)) ? 'above' : 'below'
        },
        {
          metric: 'Response Time (hours)',
          userValue: userImpact.responsesTime,
          communityAverage: this.calculateAverage(allMetrics.map(m => Number(m.response_time_hours))),
          communityMedian: this.calculateMedian(allMetrics.map(m => Number(m.response_time_hours))),
          userPercentile: this.calculatePercentile(allMetrics.map(m => Number(m.response_time_hours)), userImpact.responsesTime, true),
          trend: userImpact.responsesTime < this.calculateAverage(allMetrics.map(m => Number(m.response_time_hours))) ? 'above' : 'below'
        },
        {
          metric: 'Trust Score',
          userValue: userImpact.trustScore,
          communityAverage: this.calculateAverage(allMetrics.map(m => m.trust_score)),
          communityMedian: this.calculateMedian(allMetrics.map(m => m.trust_score)),
          userPercentile: this.calculatePercentile(allMetrics.map(m => m.trust_score), userImpact.trustScore),
          trend: userImpact.trustScore > this.calculateAverage(allMetrics.map(m => m.trust_score)) ? 'above' : 'below'
        }
      ] as CommunityComparison[];

      return metrics;
    } catch (error) {
      console.error('Error fetching community comparisons:', error);
      const userImpact = await this.getUserImpactData(userId);
      return this.getMockCommunityComparisons(userImpact);
    }
  }

  static async getImpactTrends(userId: string, days: number = 30): Promise<ImpactTrend[]> {
    try {
      // Get impact activities for trend data
      const { data: activities } = await supabase
        .from('impact_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (!activities || activities.length === 0) {
        return this.getMockTrends(days);
      }

      // Group activities by date and calculate cumulative metrics
      const trendsMap = new Map<string, Record<string, number>>();
      let cumulativeHelp = 0;
      let cumulativeVolunteer = 0;
      let cumulativePoints = 0;

      activities.forEach(activity => {
        const date = activity.created_at.split('T')[0];
        
        if (!trendsMap.has(date)) {
          trendsMap.set(date, {
            helpProvided: cumulativeHelp,
            volunteerHours: cumulativeVolunteer,
            impactScore: cumulativePoints,
            trustScore: 0 // Will be filled separately
          });
        }

        const dayData = trendsMap.get(date)!;
        
        if (activity.activity_type === 'help_provided') {
          cumulativeHelp++;
          dayData.helpProvided = cumulativeHelp;
        } else if (activity.activity_type === 'volunteer') {
          // Safely extract hours from metadata
          const metadata = activity.metadata as Record<string, any>;
          const hours = typeof metadata?.hours === 'number' ? metadata.hours : 1;
          cumulativeVolunteer += hours;
          dayData.volunteerHours = cumulativeVolunteer;
        }
        
        cumulativePoints += activity.points_earned;
        dayData.impactScore = cumulativePoints;
      });

      // Convert to ImpactTrend array
      const trends: ImpactTrend[] = [];
      trendsMap.forEach((metrics, date) => {
        Object.entries(metrics).forEach(([metric, value]) => {
          trends.push({
            date,
            value,
            metric
          });
        });
      });

      return trends.length > 0 ? trends : this.getMockTrends(days);
    } catch (error) {
      console.error('Error fetching impact trends:', error);
      return this.getMockTrends(days);
    }
  }

  static async getUserGoals(userId: string): Promise<ImpactGoal[]> {
    try {
      const { data: goals } = await supabase
        .from('impact_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!goals) return [];

      return goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || '',
        targetValue: goal.target_value,
        currentValue: goal.current_value,
        deadline: goal.deadline || '',
        category: goal.category,
        isActive: goal.is_active
      }));
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return this.getMockGoals();
    }
  }

  static async createGoal(userId: string, goal: Omit<ImpactGoal, 'id'>): Promise<ImpactGoal> {
    try {
      const { data, error } = await supabase
        .from('impact_goals')
        .insert({
          user_id: userId,
          title: goal.title,
          description: goal.description,
          target_value: goal.targetValue,
          current_value: goal.currentValue,
          deadline: goal.deadline || null,
          category: goal.category,
          is_active: goal.isActive
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        targetValue: data.target_value,
        currentValue: data.current_value,
        deadline: data.deadline || '',
        category: data.category,
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  static async updateGoalProgress(goalId: string, currentValue: number): Promise<void> {
    try {
      await supabase
        .from('impact_goals')
        .update({ current_value: currentValue })
        .eq('id', goalId);
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  }

  static async awardImpactPoints(
    userId: string,
    activityType: string,
    points: number,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.rpc('award_impact_points', {
        target_user_id: userId,
        activity_type: activityType,
        points,
        description,
        metadata
      });
    } catch (error) {
      console.error('Error awarding impact points:', error);
    }
  }

  /**
   * Award points for skill-based volunteer work using market rates
   */
  static async awardVolunteerPoints(
    userId: string,
    skillCategoryId: string,
    hours: number,
    marketRate: number,
    description: string,
    organization?: string,
    evidenceUrl?: string,
    postId?: string
  ): Promise<void> {
    try {
      const marketValue = marketRate * hours;
      const points = Math.round(marketValue * 0.5); // £1 = 0.5 points

      // If postId is provided, work needs confirmation
      const needsConfirmation = !!postId;

      const { error } = await supabase
        .from('impact_activities')
        .insert({
          user_id: userId,
          activity_type: 'volunteer_work',
          skill_category_id: skillCategoryId,
          hours_contributed: hours,
          market_rate_used: marketRate,
          market_value_gbp: marketValue,
          points_conversion_rate: 0.5,
          points_earned: points,
          description,
          post_id: postId || null,
          organization_id: null, // Will be handled separately if needed
          confirmation_status: needsConfirmation ? 'pending' : null,
          confirmation_requested_at: needsConfirmation ? new Date().toISOString() : null,
          metadata: {
            hours,
            organization,
            evidenceUrl,
            marketRate,
            marketValue,
            skill_name: skillCategoryId
          },
          verified: !needsConfirmation // Auto-verify if no confirmation needed
        });

      if (error) throw error;

      // Recalculate user metrics only if auto-verified
      if (!needsConfirmation) {
        await this.calculateUserMetrics(userId);
      }
    } catch (error) {
      console.error('Error awarding volunteer points:', error);
      throw error;
    }
  }

  static async getRecentActivities(userId: string, limit: number = 10): Promise<ImpactActivity[]> {
    try {
      const { data: activities } = await supabase
        .from('impact_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!activities) return [];

      return activities.map(activity => ({
        id: activity.id,
        activityType: activity.activity_type,
        pointsEarned: activity.points_earned,
        description: activity.description,
        metadata: (activity.metadata as Record<string, any>) || {},
        createdAt: activity.created_at,
        verified: activity.verified
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Helper methods
  private static calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + (val || 0), 0) / values.length;
  }

  private static calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = values.filter(v => v != null).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private static calculatePercentile(values: number[], userValue: number, lowerIsBetter: boolean = false): number {
    if (values.length === 0) return 50;
    const filtered = values.filter(v => v != null);
    
    if (lowerIsBetter) {
      const betterCount = filtered.filter(v => v > userValue).length;
      return Math.round((betterCount / filtered.length) * 100);
    } else {
      const worseCount = filtered.filter(v => v < userValue).length;
      return Math.round((worseCount / filtered.length) * 100);
    }
  }

  // Mock data methods for fallback
  private static getMockUserImpactData(userId: string): UserImpactData {
    return {
      userId,
      totalHelpProvided: 0,
      totalHelpReceived: 0,
      volunteerHours: 0,
      donationAmount: 0,
      communitiesJoined: 0,
      connectionsCount: 0,
      responsesTime: 0,
      trustScore: 0,
      impactScore: 0,
      rank: 1,
      percentile: 50
    };
  }

  private static getMockCommunityComparisons(userImpact: UserImpactData): CommunityComparison[] {
    return [
      {
        metric: 'Help Provided',
        userValue: userImpact.totalHelpProvided,
        communityAverage: 8.5,
        communityMedian: 6,
        userPercentile: 60,
        trend: userImpact.totalHelpProvided > 8.5 ? 'above' : 'below'
      },
      {
        metric: 'Volunteer Hours',
        userValue: userImpact.volunteerHours,
        communityAverage: 15.3,
        communityMedian: 12,
        userPercentile: 70,
        trend: userImpact.volunteerHours > 15.3 ? 'above' : 'below'
      }
    ];
  }

  private static getMockTrends(days: number): ImpactTrend[] {
    const trends: ImpactTrend[] = [];
    const metrics = ['helpProvided', 'volunteerHours', 'trustScore', 'impactScore'];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      metrics.forEach(metric => {
        trends.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 20) + Math.floor(Math.random() * i / 3),
          metric
        });
      });
    }
    
    return trends;
  }

  private static getMockGoals(): ImpactGoal[] {
    return [
      {
        id: '1',
        title: 'Help 10 People This Month',
        description: 'Complete help requests from community members',
        targetValue: 10,
        currentValue: 0,
        deadline: '2024-12-31',
        category: 'helping',
        isActive: true
      }
    ];
  }
}
