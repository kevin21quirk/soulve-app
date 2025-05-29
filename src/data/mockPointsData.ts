
import { 
  UserStats, 
  PointBreakdown, 
  LeaderboardEntry, 
  SeasonalChallenge, 
  PointTransaction 
} from "@/types/gamification";

export const mockEnhancedUserStats: UserStats = {
  totalPoints: 1247,
  level: 3,
  nextLevelPoints: 253,
  helpedCount: 23,
  connectionsCount: 47,
  postsCount: 15,
  likesReceived: 142,
  trustScore: 85,
  trustLevel: "trusted_helper"
};

export const mockPointBreakdown: PointBreakdown[] = [
  {
    category: "help_completed",
    categoryName: "Help Completed",
    totalPoints: 425,
    transactionCount: 17,
    lastActivity: "2024-01-15",
    icon: "🤝",
    color: "blue"
  },
  {
    category: "donation",
    categoryName: "Donations",
    totalPoints: 280,
    transactionCount: 28,
    lastActivity: "2024-01-14",
    icon: "💰",
    color: "green"
  },
  {
    category: "profile_verification",
    categoryName: "Verifications",
    totalPoints: 225,
    transactionCount: 15,
    lastActivity: "2024-01-10",
    icon: "✅",
    color: "purple"
  },
  {
    category: "positive_feedback",
    categoryName: "Positive Feedback",
    totalPoints: 185,
    transactionCount: 37,
    lastActivity: "2024-01-13",
    icon: "⭐",
    color: "yellow"
  },
  {
    category: "user_referral",
    categoryName: "Referrals",
    totalPoints: 132,
    transactionCount: 6,
    lastActivity: "2024-01-08",
    icon: "👥",
    color: "pink"
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
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

export const mockSeasonalChallenges: SeasonalChallenge[] = [
  {
    id: "winter-helper",
    title: "Winter Helper Challenge",
    description: "Help 10 community members this month",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    pointMultiplier: 1.5,
    targetCategories: ["help_completed", "emergency_help"],
    progress: 7,
    maxProgress: 10,
    reward: "Special Winter Helper badge + 100 bonus points",
    active: true
  },
  {
    id: "donation-drive",
    title: "Community Donation Drive",
    description: "Make 5 donations to support local causes",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    pointMultiplier: 2.0,
    targetCategories: ["donation", "matching_donation"],
    progress: 3,
    maxProgress: 5,
    reward: "Generous Giver badge + 200 bonus points",
    active: true
  },
  {
    id: "verification-boost",
    title: "Trust Building Sprint",
    description: "Complete 3 new verifications",
    startDate: "2024-01-01",
    endDate: "2024-03-01",
    pointMultiplier: 1.25,
    targetCategories: ["profile_verification"],
    progress: 2,
    maxProgress: 3,
    reward: "Trust Builder badge + Enhanced profile visibility",
    active: true
  }
];

export const mockPointTransactions: PointTransaction[] = [
  {
    id: "txn-1",
    userId: "current-user",
    category: "help_completed",
    points: 25,
    multiplier: 1,
    basePoints: 25,
    description: "Helped Sarah move to new apartment",
    timestamp: "2024-01-15T14:30:00Z",
    verified: true,
    relatedEntityId: "help-req-123"
  },
  {
    id: "txn-2",
    userId: "current-user",
    category: "donation",
    points: 10,
    multiplier: 1,
    basePoints: 10,
    description: "Donated £25 to Local Food Bank",
    timestamp: "2024-01-14T09:15:00Z",
    verified: true,
    relatedEntityId: "donation-456"
  },
  {
    id: "txn-3",
    userId: "current-user",
    category: "emergency_help",
    points: 75,
    multiplier: 1.5,
    basePoints: 50,
    description: "Emergency car repair assistance",
    timestamp: "2024-01-13T16:45:00Z",
    verified: true,
    relatedEntityId: "emergency-789"
  },
  {
    id: "txn-4",
    userId: "current-user",
    category: "positive_feedback",
    points: 5,
    multiplier: 1,
    basePoints: 5,
    description: "Received 5-star rating from John",
    timestamp: "2024-01-13T17:00:00Z",
    verified: true,
    relatedEntityId: "feedback-101"
  },
  {
    id: "txn-5",
    userId: "current-user",
    category: "profile_verification",
    points: 15,
    multiplier: 1,
    basePoints: 15,
    description: "Completed phone verification",
    timestamp: "2024-01-12T11:30:00Z",
    verified: true,
    relatedEntityId: "verification-202"
  }
];
