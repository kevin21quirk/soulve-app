
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  helpedCount: number;
  connectionsCount: number;
  postsCount: number;
  likesReceived: number;
  trustScore: number;
  trustLevel: TrustLevel;
}

export type TrustLevel = "new_user" | "verified_helper" | "trusted_helper" | "community_leader" | "impact_champion";

export interface TrustLevelConfig {
  level: TrustLevel;
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
}

export type PointCategory = 
  | "help_completed"
  | "emergency_help"
  | "recurring_help"
  | "group_help"
  | "donation"
  | "recurring_donation"
  | "fundraiser_created"
  | "fundraiser_raised"
  | "matching_donation"
  | "profile_verification"
  | "crb_check"
  | "verification_anniversary"
  | "positive_feedback"
  | "user_referral"
  | "community_group_created"
  | "community_event_organized"
  | "ambassador_activity";

export interface PointTransaction {
  id: string;
  userId: string;
  category: PointCategory;
  points: number;
  multiplier?: number;
  basePoints: number;
  description: string;
  timestamp: string;
  verified: boolean;
  relatedEntityId?: string; // ID of help request, donation, etc.
  metadata?: Record<string, any>;
}

export interface PointBreakdown {
  category: PointCategory;
  categoryName: string;
  totalPoints: number;
  transactionCount: number;
  lastActivity?: string;
  icon: string;
  color: string;
}

export interface CommunityImpactStats {
  totalCommunityPoints: number;
  totalHelpActions: number;
  totalDonations: number;
  totalVolunteerHours: number;
  activeHelpers: number;
  impactMilestones: ImpactMilestone[];
}

export interface ImpactMilestone {
  id: string;
  title: string;
  description: string;
  targetPoints: number;
  currentPoints: number;
  reward: string;
  unlocked: boolean;
}

export interface SeasonalChallenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  pointMultiplier: number;
  targetCategories: PointCategory[];
  progress: number;
  maxProgress: number;
  reward: string;
  active: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  totalPoints: number;
  trustLevel: TrustLevel;
  rank: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
}

export interface PointsSystemConfig {
  basePointValues: Record<PointCategory, number>;
  multipliers: {
    recurring_bonus: number;
    consistency_bonus: number;
    group_help_multiplier: number;
    matching_donation_multiplier: number;
    recurring_donation_bonus: number;
  };
  trustLevels: TrustLevelConfig[];
  cooldownPeriods: Record<PointCategory, number>; // in minutes
  verificationThresholds: Record<string, number>;
}
