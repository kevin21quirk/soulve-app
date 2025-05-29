
import { LeaderboardEntry, UserStats } from '@/types/gamification';

export class LeaderboardService {
  private static mockLeaderboard: LeaderboardEntry[] = [
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
      userId: "user-2",
      userName: "Marcus Johnson",
      avatar: "/avatars/marcus.jpg",
      totalPoints: 2134,
      trustLevel: "community_leader",
      rank: 2,
      weeklyPoints: 134,
      monthlyPoints: 521
    },
    {
      userId: "current-user",
      userName: "Alex Thompson",
      avatar: "/avatars/alex.jpg",
      totalPoints: 1247,
      trustLevel: "trusted_helper",
      rank: 3,
      weeklyPoints: 89,
      monthlyPoints: 387
    },
    {
      userId: "user-4",
      userName: "Emily Rodriguez",
      avatar: "/avatars/emily.jpg",
      totalPoints: 1156,
      trustLevel: "trusted_helper",
      rank: 4,
      weeklyPoints: 76,
      monthlyPoints: 298
    },
    {
      userId: "user-5",
      userName: "David Kim",
      avatar: "/avatars/david.jpg",
      totalPoints: 892,
      trustLevel: "verified_helper",
      rank: 5,
      weeklyPoints: 67,
      monthlyPoints: 234
    }
  ];

  static getLeaderboard(type: 'weekly' | 'monthly' | 'all-time' = 'all-time'): LeaderboardEntry[] {
    const sorted = [...this.mockLeaderboard].sort((a, b) => {
      switch (type) {
        case 'weekly':
          return b.weeklyPoints - a.weeklyPoints;
        case 'monthly':
          return b.monthlyPoints - a.monthlyPoints;
        default:
          return b.totalPoints - a.totalPoints;
      }
    });

    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }

  static getUserRank(userId: string, type: 'weekly' | 'monthly' | 'all-time' = 'all-time'): number {
    const leaderboard = this.getLeaderboard(type);
    const userEntry = leaderboard.find(entry => entry.userId === userId);
    return userEntry?.rank || 0;
  }

  static getTopPerformers(limit: number = 10): LeaderboardEntry[] {
    return this.getLeaderboard().slice(0, limit);
  }

  static updateUserStats(userId: string, userStats: UserStats) {
    const userIndex = this.mockLeaderboard.findIndex(entry => entry.userId === userId);
    if (userIndex !== -1) {
      this.mockLeaderboard[userIndex] = {
        ...this.mockLeaderboard[userIndex],
        totalPoints: userStats.totalPoints,
        trustLevel: userStats.trustLevel
      };
    }
  }
}
