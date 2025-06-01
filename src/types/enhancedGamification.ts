
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
  created_at: string;
  updated_at: string;
}

// Enhanced point categories with updated values
export const ENHANCED_POINT_VALUES: Record<string, number> = {
  // Help & Community (10-50 points based on effort/rating)
  help_completed: 25, // Base value, scaled 10-50
  emergency_help: 100,
  recurring_help: 15,
  group_help: 30,
  
  // Donations (£1 = 1 point base)
  donation: 1, // Per £1 donated
  recurring_donation: 1.2, // 20% bonus
  fundraiser_created: 50,
  fundraiser_raised: 0.5, // Per £1 raised for others
  matching_donation: 2, // Double points
  
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

// Enhanced trust tier thresholds
export const ENHANCED_TRUST_TIERS = [
  {
    level: 'basic',
    name: 'Basic Member',
    minPoints: 0,
    maxPoints: 99,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    benefits: [
      'Access to basic features',
      'Can request help',
      'Can participate in discussions'
    ]
  },
  {
    level: 'verified_helper',
    name: 'Verified Helper',
    minPoints: 100,
    maxPoints: 499,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    benefits: [
      'Priority in help requests',
      'Can create fundraisers',
      'Access to community groups',
      'Verification badges'
    ]
  },
  {
    level: 'trusted_helper',
    name: 'Trusted Helper',
    minPoints: 500,
    maxPoints: 999,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    benefits: [
      'Can mentor new users',
      'Access to exclusive events',
      'Reduced verification requirements',
      'Priority support'
    ]
  },
  {
    level: 'community_leader',
    name: 'Community Leader',
    minPoints: 1000,
    maxPoints: 4999,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    benefits: [
      'Can moderate discussions',
      'Featured in recommendations',
      'Access to beta features',
      'Leadership opportunities'
    ]
  },
  {
    level: 'impact_champion',
    name: 'Impact Champion',
    minPoints: 5000,
    maxPoints: Infinity,
    color: 'text-gold-600',
    bgColor: 'bg-yellow-100',
    benefits: [
      'Platform ambassador status',
      'Direct access to team',
      'Influence platform features',
      'Speaking opportunities'
    ]
  }
];

export interface FraudProtectionConfig {
  pointBurstThreshold: number; // 300 points/day
  patternFarmingThreshold: number; // 10 same actions/month
  decayRate: number; // 5% per 30 days
  maxDecay: number; // 50% total cap
  inactivityPeriod: number; // 30 days
  evidenceRequiredThreshold: number; // Points value requiring evidence
  highValueActionThreshold: number; // Points requiring manual review
}

export const DEFAULT_FRAUD_CONFIG: FraudProtectionConfig = {
  pointBurstThreshold: 300,
  patternFarmingThreshold: 10,
  decayRate: 5,
  maxDecay: 50,
  inactivityPeriod: 30,
  evidenceRequiredThreshold: 50,
  highValueActionThreshold: 100
};
