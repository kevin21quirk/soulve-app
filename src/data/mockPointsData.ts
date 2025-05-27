
import { 
  PointTransaction, 
  UserStats, 
  CommunityImpactStats, 
  ImpactMilestone, 
  SeasonalChallenge, 
  LeaderboardEntry,
  PointBreakdown
} from "@/types/gamification";
import { PointsCalculator } from "@/services/pointsService";

// Mock point transactions for the current user
export const mockPointTransactions: PointTransaction[] = [
  {
    id: "pt_1",
    userId: "current-user",
    category: "profile_verification",
    points: 50,
    multiplier: 1,
    basePoints: 50,
    description: "Completed profile verification",
    timestamp: "2024-01-20T10:00:00Z",
    verified: true
  },
  {
    id: "pt_2",
    userId: "current-user",
    category: "help_completed",
    points: 25,
    multiplier: 1,
    basePoints: 25,
    description: "Helped with moving furniture",
    timestamp: "2024-01-22T14:30:00Z",
    verified: true,
    relatedEntityId: "help_req_123"
  },
  {
    id: "pt_3",
    userId: "current-user",
    category: "donation",
    points: 50,
    multiplier: 1,
    basePoints: 50,
    description: "Donation of £50",
    timestamp: "2024-01-25T09:15:00Z",
    verified: true,
    relatedEntityId: "donation_456"
  },
  {
    id: "pt_4",
    userId: "current-user",
    category: "group_help",
    points: 32,
    multiplier: 1.1,
    basePoints: 30,
    description: "Group help event with 3 helpers",
    timestamp: "2024-02-01T16:00:00Z",
    verified: true,
    metadata: { additionalHelpers: 2 }
  },
  {
    id: "pt_5",
    userId: "current-user",
    category: "recurring_help",
    points: 28,
    multiplier: 1.1,
    basePoints: 25,
    description: "Recurring help with consistency bonus (6 consecutive)",
    timestamp: "2024-02-05T11:00:00Z",
    verified: true,
    metadata: { consecutiveHelps: 6 }
  },
  {
    id: "pt_6",
    userId: "current-user",
    category: "positive_feedback",
    points: 15,
    multiplier: 1,
    basePoints: 15,
    description: "Received 5-star rating",
    timestamp: "2024-02-06T12:30:00Z",
    verified: true,
    metadata: { rating: 5 }
  },
  {
    id: "pt_7",
    userId: "current-user",
    category: "user_referral",
    points: 25,
    multiplier: 1,
    basePoints: 25,
    description: "Referred new user who completed verification",
    timestamp: "2024-02-10T08:45:00Z",
    verified: true,
    relatedEntityId: "user_789"
  },
  {
    id: "pt_8",
    userId: "current-user",
    category: "emergency_help",
    points: 100,
    multiplier: 1,
    basePoints: 100,
    description: "Emergency assistance during storm",
    timestamp: "2024-02-12T18:20:00Z",
    verified: true,
    relatedEntityId: "emergency_321"
  },
  {
    id: "pt_9",
    userId: "current-user",
    category: "crb_check",
    points: 100,
    multiplier: 1,
    basePoints: 100,
    description: "CRB check completed",
    timestamp: "2024-02-15T13:00:00Z",
    verified: true
  },
  {
    id: "pt_10",
    userId: "current-user",
    category: "community_event_organized",
    points: 75,
    multiplier: 1.5,
    basePoints: 50,
    description: "Organized neighborhood cleanup event",
    timestamp: "2024-02-18T10:00:00Z",
    verified: true,
    relatedEntityId: "event_555"
  }
];

// Calculate total points from transactions
const totalPoints = mockPointTransactions.reduce((sum, t) => sum + t.points, 0);

// Enhanced user stats with trust integration
export const mockEnhancedUserStats: UserStats = {
  totalPoints,
  level: Math.floor(totalPoints / 100) + 1,
  nextLevelPoints: (Math.floor(totalPoints / 100) + 1) * 100,
  helpedCount: 23,
  connectionsCount: 42,
  postsCount: 15,
  likesReceived: 156,
  trustScore: 95,
  trustLevel: PointsCalculator.getTrustLevel(totalPoints)
};

// Mock community impact stats
export const mockCommunityImpactStats: CommunityImpactStats = {
  totalCommunityPoints: 125000,
  totalHelpActions: 1250,
  totalDonations: 85000,
  totalVolunteerHours: 3200,
  activeHelpers: 340,
  impactMilestones: [
    {
      id: "milestone_1",
      title: "Community Helper",
      description: "100,000 total community points",
      targetPoints: 100000,
      currentPoints: 125000,
      reward: "Community Helper Badge for all members",
      unlocked: true
    },
    {
      id: "milestone_2", 
      title: "Neighborhood Champion",
      description: "150,000 total community points",
      targetPoints: 150000,
      currentPoints: 125000,
      reward: "Local business partnership discounts",
      unlocked: false
    },
    {
      id: "milestone_3",
      title: "Impact Network",
      description: "250,000 total community points",
      targetPoints: 250000,
      currentPoints: 125000,
      reward: "Regional recognition event",
      unlocked: false
    }
  ]
};

// Mock seasonal challenges
export const mockSeasonalChallenges: SeasonalChallenge[] = [
  {
    id: "winter_challenge_2024",
    title: "Winter Warmth Challenge",
    description: "Help elderly neighbors and make donations during winter months",
    startDate: "2024-12-01T00:00:00Z",
    endDate: "2024-02-29T23:59:59Z",
    pointMultiplier: 1.5,
    targetCategories: ["help_completed", "donation", "emergency_help"],
    progress: 75,
    maxProgress: 100,
    reward: "Winter Helper Badge + £25 local business voucher",
    active: true
  },
  {
    id: "spring_community_2024",
    title: "Spring Community Building",
    description: "Organize events and build connections in your community",
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-05-31T23:59:59Z",
    pointMultiplier: 2.0,
    targetCategories: ["community_event_organized", "community_group_created", "user_referral"],
    progress: 0,
    maxProgress: 100,
    reward: "Community Builder Badge + Premium features access",
    active: false
  }
];

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "user_1",
    userName: "Sarah Mitchell",
    avatar: "/avatars/sarah.jpg",
    totalPoints: 2150,
    trustLevel: "community_leader",
    rank: 1,
    weeklyPoints: 180,
    monthlyPoints: 650
  },
  {
    userId: "current-user",
    userName: "Alex Johnson",
    avatar: "/avatars/alex.jpg",
    totalPoints: totalPoints,
    trustLevel: mockEnhancedUserStats.trustLevel,
    rank: 2,
    weeklyPoints: 120,
    monthlyPoints: 420
  },
  {
    userId: "user_3",
    userName: "Marcus Chen",
    avatar: "/avatars/marcus.jpg", 
    totalPoints: 480,
    trustLevel: "verified_helper",
    rank: 3,
    weeklyPoints: 95,
    monthlyPoints: 280
  },
  {
    userId: "user_4",
    userName: "Emma Thompson",
    avatar: "/avatars/emma.jpg",
    totalPoints: 340,
    trustLevel: "verified_helper", 
    rank: 4,
    weeklyPoints: 60,
    monthlyPoints: 150
  },
  {
    userId: "user_5",
    userName: "David Rodriguez",
    avatar: "/avatars/david.jpg",
    totalPoints: 280,
    trustLevel: "verified_helper",
    rank: 5,
    weeklyPoints: 45,
    monthlyPoints: 130
  }
];

// Calculate point breakdown for current user
export const mockPointBreakdown: PointBreakdown[] = PointsCalculator.calculatePointBreakdown(mockPointTransactions);
