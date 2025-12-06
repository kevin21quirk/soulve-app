
import { PointTransaction, Achievement, UserStats, LeaderboardEntry, SeasonalChallenge } from '@/types/gamification';
import { realTimePointsService } from './realTimePointsService';

export interface BackendConfig {
  useRealData: boolean;
  apiEndpoint?: string;
  authToken?: string;
}

export class BackendDataService {
  private static config: BackendConfig = {
    useRealData: false // Toggle this to switch between mock and real data
  };

  private static mockTransactions: PointTransaction[] = [
    {
      id: "txn-001",
      userId: "current-user",
      category: "help_completed",
      points: 25,
      multiplier: 1,
      basePoints: 25,
      description: "Helped with grocery shopping",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      verified: true
    },
    {
      id: "txn-002",
      userId: "current-user",
      category: "donation",
      points: 50,
      multiplier: 2,
      basePoints: 25,
      description: "Donated to local food bank",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      verified: true
    },
    {
      id: "txn-003",
      userId: "current-user",
      category: "emergency_help",
      points: 100,
      multiplier: 2,
      basePoints: 50,
      description: "Emergency assistance with transport",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true
    }
  ];

  static async getUserTransactions(userId: string): Promise<PointTransaction[]> {
    if (this.config.useRealData) {
      // Real API call would go here
      return this.fetchFromAPI(`/users/${userId}/transactions`);
    }
    return this.mockTransactions.filter(t => t.userId === userId);
  }

  static async getUserStats(userId: string): Promise<UserStats> {
    if (this.config.useRealData) {
      return this.fetchFromAPI(`/users/${userId}/stats`);
    }
    
    const transactions = await this.getUserTransactions(userId);
    const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);
    
    return {
      totalPoints,
      level: Math.floor(totalPoints / 500) + 1,
      nextLevelPoints: 500 - (totalPoints % 500),
      helpedCount: transactions.filter(t => ['help_completed', 'emergency_help'].includes(t.category)).length,
      connectionsCount: 42,
      postsCount: 15,
      likesReceived: 89,
      trustScore: Math.min(totalPoints / 10, 100),
      trustLevel: totalPoints >= 3000 ? 'impact_champion' : 
                  totalPoints >= 1500 ? 'community_leader' :
                  totalPoints >= 500 ? 'trusted_helper' :
                  totalPoints >= 100 ? 'verified_helper' : 'new_user'
    };
  }

  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (this.config.useRealData) {
      return this.fetchFromAPI('/leaderboard');
    }
    
    return [
      {
        userId: "user-1",
        userName: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        totalPoints: 2847,
        trustLevel: "impact_champion",
        rank: 1,
        weeklyPoints: 156,
        monthlyPoints: 642
      },
      {
        userId: "current-user",
        userName: "Alex Thompson",
        avatar: "/avatars/alex.jpg",
        totalPoints: 1247,
        trustLevel: "trusted_helper",
        rank: 2,
        weeklyPoints: 89,
        monthlyPoints: 387
      }
    ];
  }

  static async awardPoints(userId: string, category: any, description: string): Promise<PointTransaction> {
    const transaction = await realTimePointsService.awardPoints(userId, category, description);
    
    if (this.config.useRealData) {
      await this.postToAPI('/transactions', transaction);
    } else {
      this.mockTransactions.push(transaction);
    }
    
    return transaction;
  }

  private static async fetchFromAPI(endpoint: string): Promise<any> {
    const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  private static async postToAPI(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static configureBackend(config: BackendConfig) {
    this.config = { ...this.config, ...config };
  }
}
