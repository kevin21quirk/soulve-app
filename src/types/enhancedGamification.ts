
export interface RedFlag {
  id: string;
  user_id: string;
  flag_type: 'dispute' | 'reversal' | 'suspicious_activity' | 'pattern_farming' | 'point_burst' | 'fake_evidence';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: Record<string, any>;
  status: 'active' | 'resolved' | 'dismissed';
  flagged_by?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PointDecayLog {
  id: string;
  user_id: string;
  points_before: number;
  points_after: number;
  decay_percentage: number;
  reason: string;
  last_activity_date?: string;
  applied_at: string;
}

export interface FraudDetectionLog {
  id: string;
  user_id: string;
  detection_type: 'point_burst' | 'pattern_farming' | 'rapid_actions' | 'suspicious_timing' | 'location_anomaly';
  threshold_value: number;
  actual_value: number;
  time_window: string;
  metadata: Record<string, any>;
  risk_score: number;
  auto_flagged: boolean;
  reviewed: boolean;
  reviewer_id?: string;
  created_at: string;
}

export interface EvidenceSubmission {
  id: string;
  user_id: string;
  activity_id?: string;
  evidence_type: 'photo' | 'video' | 'document' | 'geolocation' | 'timestamp' | 'witness_confirmation';
  file_url?: string;
  metadata: Record<string, any>;
  verification_status: 'pending' | 'approved' | 'rejected' | 'requires_review';
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface TrustDomain {
  id: string;
  user_id: string;
  domain: 'elderly_support' | 'event_organization' | 'emergency_response' | 'fundraising' | 'community_building' | 'education' | 'environmental';
  domain_score: number;
  actions_count: number;
  average_rating: number;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedImpactMetrics {
  user_id: string;
  impact_score: number;
  trust_score: number;
  help_provided_count: number;
  help_received_count: number;
  volunteer_hours: number;
  donation_amount: number;
  connections_count: number;
  response_time_hours: number;
  average_rating: number;
  red_flag_count: number;
  last_activity_date?: string;
  xp_points: number;
  decay_applied_count: number;
  calculated_at: string;
}

export interface EnhancedImpactActivity {
  id: string;
  user_id: string;
  activity_type: string;
  points_earned: number;
  description: string;
  metadata: Record<string, any>;
  verified: boolean;
  effort_level: number;
  requires_evidence: boolean;
  evidence_submitted: boolean;
  risk_score: number;
  auto_verified: boolean;
  points_state?: 'active' | 'pending' | 'escrow' | 'reversed';
  trust_score_at_award?: number;
  created_at: string;
  updated_at: string;
}

// Enhanced point categories with updated values - REVENUE-FOCUSED SYSTEM
export const ENHANCED_POINT_VALUES: Record<string, number> = {
  // Help & Community Actions
  help_completed: 25,
  emergency_help: 100,
  recurring_help: 15,
  group_help: 30,
  
  // Donations - Tiered by Amount (£1 = X points) - NEVER DECAY
  donation_tier_1: 2,      // £0-£49: £1 = 2 points
  donation_tier_2: 4,      // £50-£249: £1 = 4 points
  donation_tier_3: 6,      // £250-£999: £1 = 6 points
  donation_tier_4: 8,      // £1,000-£4,999: £1 = 8 points
  donation_tier_5: 10,     // £5,000+: £1 = 10 points
  
  // Legacy point values (for backward compatibility)
  donation: 2,
  recurring_donation: 4,
  matching_donation: 8,
  
  // Fundraising - High Value Revenue Generation
  fundraiser_created: 200,              // Creating campaign
  fundraiser_tier_1: 2,                 // Raising £0-£499: £1 = 2 points
  fundraiser_tier_2: 3,                 // Raising £500-£2,499: £1 = 3 points
  fundraiser_tier_3: 4,                 // Raising £2,500-£9,999: £1 = 4 points
  fundraiser_tier_4: 5,                 // Raising £10,000+: £1 = 5 points
  fundraiser_raised: 2,                 // Legacy value
  
  // Premium Subscriptions - Recurring Revenue
  premium_monthly: 500,                 // £10/month subscription
  premium_quarterly: 1800,              // £25/quarter subscription (bonus 200)
  premium_annual: 7000,                 // £100/year subscription (bonus 1000)
  premium_vip: 15000,                   // £250/year VIP subscription
  
  // Engagement & Growth (low values for frequency actions)
  weekly_login: 1,
  tutorial_completion: 5,
  upvoting: 1,
  post_creation: 5,
  comment_helpful: 2,
  
  // Verification & Trust
  profile_verification: 25,
  crb_check: 100,
  verification_anniversary: 10,
  positive_feedback: 3,
  
  // Community Building
  user_referral: 20,
  community_group_created: 75,
  community_event_organized: 50,
  ambassador_activity: 40,
  
  // Volunteer Work
  volunteer_hour: 3, // Per hour
  volunteer_event: 25,
  skilled_volunteer: 5 // Per hour for skilled work
};

// Activities that are exempt from points decay (campaign-related)
export const DECAY_EXEMPT_ACTIVITIES = [
  'donation',
  'recurring_donation', 
  'fundraiser_created',
  'fundraiser_raised',
  'matching_donation'
];

// Enhanced trust tier thresholds
export const ENHANCED_TRUST_TIERS = [
  {
    name: 'Basic Member',
    minPoints: 0,
    maxPoints: 99,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: '🌱',
    benefits: ['Basic platform access', 'Community participation', 'Help request capability']
  },
  {
    name: 'Verified Helper',
    minPoints: 100,
    maxPoints: 499,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: '🤝',
    benefits: ['Verified badge', 'Increased visibility', 'Priority in matching']
  },
  {
    name: 'Trusted Helper',
    minPoints: 500,
    maxPoints: 999,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: '⭐',
    benefits: ['Trust badge', 'Advanced features', 'Group creation', 'Event hosting']
  },
  {
    name: 'Community Leader',
    minPoints: 1000,
    maxPoints: 4999,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    icon: '👑',
    benefits: ['Leadership badge', 'Moderation tools', 'Featured profile', 'Campaign priority']
  },
  {
    name: 'Impact Champion',
    minPoints: 5000,
    maxPoints: 19999,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    icon: '🏆',
    benefits: ['Champion badge', 'All features', 'Advisory access', 'Partnership opportunities']
  },
  {
    name: 'Platinum Patron',
    minPoints: 20000,
    maxPoints: 49999,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-300',
    icon: '💎',
    benefits: ['Platinum badge', 'VIP support', 'Exclusive events', 'Revenue insights', 'Early feature access']
  },
  {
    name: 'Diamond Donor',
    minPoints: 50000,
    maxPoints: 99999,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-300',
    icon: '💍',
    benefits: ['Diamond badge', 'Dedicated support', 'Strategic partnership', 'Co-branding opportunities', 'Quarterly strategy calls']
  },
  {
    name: 'Legacy Builder',
    minPoints: 100000,
    maxPoints: 499999,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    icon: '🌟',
    benefits: ['Legacy badge', 'Named recognition', 'Board advisory role', 'Revenue share program', 'Custom features']
  },
  {
    name: 'Visionary Founder',
    minPoints: 500000,
    maxPoints: Infinity,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-300',
    icon: '🚀',
    benefits: ['Founder badge', 'Permanent recognition', 'Equity opportunities', 'Strategic decision input', 'Lifetime VIP status']
  }
];

export interface FraudProtectionConfig {
  pointBurstThreshold: number;
  pointBurstThresholdRevenue: number;
  patternFarmingThreshold: number;
  rapidSuccessionThreshold: number;
  decayRate: number;
  maxDecay: number;
  inactivityPeriod: number;
  evidenceRequiredThreshold: number;
  highValueActionThreshold: number;
  autoFlagRiskScore: number;
}

export const DEFAULT_FRAUD_CONFIG: FraudProtectionConfig = {
  pointBurstThreshold: 1000,              // Max 1000 points per day (non-revenue)
  pointBurstThresholdRevenue: Infinity,   // UNLIMITED for donations/fundraising
  patternFarmingThreshold: 15,            // Max 15 same actions per month (increased)
  rapidSuccessionThreshold: 20,           // Max 20 actions per hour (increased)
  decayRate: 5,                           // 5% per 30 days (non-campaign only)
  maxDecay: 50,                           // 50% total cap
  inactivityPeriod: 30,                   // 30 days
  evidenceRequiredThreshold: 100,         // Actions worth 100+ points need evidence
  highValueActionThreshold: 200,          // 200+ points require manual review
  autoFlagRiskScore: 8.0                  // Auto-flag if risk score ≥ 8.0
};
