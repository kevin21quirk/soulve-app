
import { supabase } from '@/integrations/supabase/client';
import { 
  EnhancedImpactActivity, 
  EnhancedImpactMetrics, 
  RedFlag, 
  FraudDetectionLog, 
  EvidenceSubmission,
  TrustDomain,
  ENHANCED_POINT_VALUES,
  DEFAULT_FRAUD_CONFIG
} from '@/types/enhancedGamification';

export class EnhancedPointsService {
  // Award points with enhanced fraud protection and evidence requirements
  static async awardPoints(
    userId: string,
    activityType: string,
    basePoints: number,
    description: string,
    metadata: Record<string, any> = {},
    effortLevel: number = 3,
    requiresEvidence: boolean = false
  ): Promise<EnhancedImpactActivity> {
    // Calculate final points based on effort level and activity type
    const pointMultiplier = this.getEffortMultiplier(effortLevel);
    const finalPoints = Math.round(basePoints * pointMultiplier);
    
    // Check if evidence is required for high-value actions
    const needsEvidence = requiresEvidence || finalPoints >= DEFAULT_FRAUD_CONFIG.evidenceRequiredThreshold;
    
    // Calculate risk score
    const riskScore = await this.calculateRiskScore(userId, activityType, finalPoints);
    
    // Get user's current trust score to determine points state
    const { data: metrics } = await supabase
      .from('impact_metrics')
      .select('trust_score')
      .eq('user_id', userId)
      .maybeSingle();
    
    const trustScore = metrics?.trust_score || 50;
    
    // Determine points state based on trust score (TRUST-BASED SYSTEM)
    let pointsState = 'active';
    if (needsEvidence) {
      if (trustScore < 50) {
        pointsState = 'escrow'; // Low trust: points held until verified
      } else if (trustScore < 80) {
        pointsState = 'pending'; // Medium trust: points awarded but not counting yet
      }
      // High trust (80+): points 'active' immediately, post-verification review
    }
    
    const { data, error } = await supabase
      .from('impact_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        points_earned: finalPoints,
        description,
        metadata,
        effort_level: effortLevel,
        requires_evidence: needsEvidence,
        evidence_submitted: !needsEvidence,
        risk_score: riskScore,
        auto_verified: riskScore < 5.0 && !needsEvidence && trustScore >= 80,
        verified: riskScore < 5.0 && !needsEvidence && trustScore >= 80,
        points_state: pointsState,
        trust_score_at_award: trustScore
      })
      .select()
      .single();

    if (error) throw error;

    // Run fraud detection
    await this.runFraudDetection(userId);
    
    // Update user metrics
    await this.updateUserMetrics(userId);
    
    return data as EnhancedImpactActivity;
  }

  // Calculate effort-based point multiplier
  private static getEffortMultiplier(effortLevel: number): number {
    const multipliers = {
      1: 0.4,  // Minimal effort (10 points base)
      2: 0.6,  // Low effort (15 points base)
      3: 1.0,  // Average effort (25 points base)
      4: 1.4,  // Good effort (35 points base)
      5: 2.0   // Excellent effort (50 points base)
    };
    return multipliers[effortLevel as keyof typeof multipliers] || 1.0;
  }

  // Calculate risk score for fraud detection
  private static async calculateRiskScore(
    userId: string,
    activityType: string,
    points: number
  ): Promise<number> {
    let riskScore = 0;

    // Revenue-generating activities have NO point burst limits
    const revenueActivities = ['donation', 'recurring_donation', 'fundraiser_raised', 'matching_donation', 'premium_monthly', 'premium_quarterly', 'premium_annual'];
    const isRevenueActivity = revenueActivities.includes(activityType);

    // Check recent activity patterns
    const { data: recentActivities } = await supabase
      .from('impact_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentActivities) {
      // Separate revenue and non-revenue points
      const todayRevenuePoints = recentActivities
        .filter(act => revenueActivities.includes(act.activity_type))
        .reduce((sum, act) => sum + act.points_earned, 0);
      
      const todayNonRevenuePoints = recentActivities
        .filter(act => !revenueActivities.includes(act.activity_type))
        .reduce((sum, act) => sum + act.points_earned, 0);
      
      const sameTypeCount = recentActivities.filter(act => act.activity_type === activityType).length;
      
      // Apply point burst detection ONLY to non-revenue activities
      if (!isRevenueActivity && todayNonRevenuePoints + points > DEFAULT_FRAUD_CONFIG.pointBurstThreshold) {
        riskScore += 8.0;
      }
      
      // Repetitive actions (more lenient now)
      if (sameTypeCount > DEFAULT_FRAUD_CONFIG.patternFarmingThreshold) {
        riskScore += 6.0;
      }
      
      // Rapid succession (more lenient now)
      if (recentActivities.length > DEFAULT_FRAUD_CONFIG.rapidSuccessionThreshold) {
        riskScore += 4.0;
      }
    }

    // Revenue activities get significantly lower risk scores
    if (isRevenueActivity) {
      riskScore = riskScore * 0.3; // 70% risk reduction for revenue
    }

    return Math.min(riskScore, 10.0);
  }

  // Run comprehensive fraud detection
  static async runFraudDetection(userId: string): Promise<void> {
    const { error } = await supabase.rpc('detect_fraud_patterns', {
      target_user_id: userId
    });
    
    if (error) {
      console.error('Fraud detection error:', error);
    }
  }

  // Update user metrics with enhanced trust calculation
  static async updateUserMetrics(userId: string): Promise<void> {
    const { error } = await supabase.rpc('calculate_enhanced_trust_score', {
      user_uuid: userId
    });
    
    if (error) {
      console.error('Trust score calculation error:', error);
    }
  }

  // Apply point decay for inactive users
  static async applyPointDecay(): Promise<void> {
    const { error } = await supabase.rpc('apply_point_decay');
    
    if (error) {
      console.error('Point decay error:', error);
    }
  }

  // Get user's enhanced metrics
  static async getUserMetrics(userId: string): Promise<EnhancedImpactMetrics | null> {
    const { data, error } = await supabase
      .from('impact_metrics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user metrics:', error);
      return null;
    }
    
    return data as EnhancedImpactMetrics | null;
  }

  // Get user's trust domains
  static async getUserTrustDomains(userId: string): Promise<TrustDomain[]> {
    const { data, error } = await supabase
      .from('trust_domains')
      .select('*')
      .eq('user_id', userId)
      .order('domain_score', { ascending: false });

    if (error) {
      console.error('Error fetching trust domains:', error);
      return [];
    }
    return data as TrustDomain[] || [];
  }

  // Get user's red flags
  static async getUserRedFlags(userId: string): Promise<RedFlag[]> {
    const { data, error } = await supabase
      .from('red_flags')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching red flags:', error);
      return [];
    }
    return data as RedFlag[] || [];
  }

  // Submit evidence for an activity
  static async submitEvidence(
    userId: string,
    activityId: string,
    evidenceType: string,
    fileUrl?: string,
    metadata: Record<string, any> = {}
  ): Promise<EvidenceSubmission> {
    const { data, error } = await supabase
      .from('evidence_submissions')
      .insert({
        user_id: userId,
        activity_id: activityId,
        evidence_type: evidenceType,
        file_url: fileUrl,
        metadata
      })
      .select()
      .single();

    if (error) throw error;

    // Update the activity to mark evidence as submitted
    await supabase
      .from('impact_activities')
      .update({ evidence_submitted: true })
      .eq('id', activityId);

    return data as EvidenceSubmission;
  }

  // Get fraud detection logs for admin
  static async getFraudDetectionLogs(limit: number = 50): Promise<FraudDetectionLog[]> {
    const { data, error } = await supabase
      .from('fraud_detection_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as FraudDetectionLog[];
  }

  // Calculate trust tier from points - EXPANDED TIER SYSTEM
  static getTrustTier(points: number) {
    const tiers = [
      { name: 'Visionary Founder', min: 500000, color: 'text-rose-600', bgColor: 'bg-rose-100', icon: '🚀' },
      { name: 'Legacy Builder', min: 100000, color: 'text-amber-600', bgColor: 'bg-amber-100', icon: '🌟' },
      { name: 'Diamond Donor', min: 50000, color: 'text-pink-600', bgColor: 'bg-pink-100', icon: '💍' },
      { name: 'Platinum Patron', min: 20000, color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: '💎' },
      { name: 'Impact Champion', min: 5000, color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🏆' },
      { name: 'Community Leader', min: 1000, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '👑' },
      { name: 'Trusted Helper', min: 500, color: 'text-green-600', bgColor: 'bg-green-100', icon: '⭐' },
      { name: 'Verified Helper', min: 100, color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🤝' },
      { name: 'Basic Member', min: 0, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🌱' }
    ];

    return tiers.find(tier => points >= tier.min) || tiers[tiers.length - 1];
  }

  // Award help completion points with effort-based scaling
  static async awardHelpCompletionPoints(
    helperId: string,
    postId: string,
    rating: number,
    effortLevel: number = 3,
    isEmergency: boolean = false
  ): Promise<void> {
    const basePoints = isEmergency ? ENHANCED_POINT_VALUES.emergency_help : ENHANCED_POINT_VALUES.help_completed;
    const finalPoints = Math.round(basePoints * this.getEffortMultiplier(effortLevel));

    await this.awardPoints(
      helperId,
      isEmergency ? 'emergency_help' : 'help_completed',
      finalPoints,
      `Help completed with ${rating}/5 rating`,
      {
        post_id: postId,
        rating,
        effort_level: effortLevel,
        is_emergency: isEmergency
      },
      effortLevel,
      finalPoints >= 50 // Require evidence for high-value help
    );
  }

  // Award donation points with TIERED SYSTEM
  static async awardDonationPoints(
    userId: string,
    amount: number,
    isRecurring: boolean = false,
    isMatching: boolean = false
  ): Promise<void> {
    // Tiered donation point calculation
    let pointsPerPound: number;
    
    if (isMatching) {
      pointsPerPound = ENHANCED_POINT_VALUES.matching_donation; // £1 = 8 points
    } else if (isRecurring) {
      pointsPerPound = ENHANCED_POINT_VALUES.recurring_donation; // £1 = 4 points
    } else {
      // Tiered system for one-time donations
      if (amount >= 5000) {
        pointsPerPound = ENHANCED_POINT_VALUES.donation_tier_5; // £1 = 10 points
      } else if (amount >= 1000) {
        pointsPerPound = ENHANCED_POINT_VALUES.donation_tier_4; // £1 = 8 points
      } else if (amount >= 250) {
        pointsPerPound = ENHANCED_POINT_VALUES.donation_tier_3; // £1 = 6 points
      } else if (amount >= 50) {
        pointsPerPound = ENHANCED_POINT_VALUES.donation_tier_2; // £1 = 4 points
      } else {
        pointsPerPound = ENHANCED_POINT_VALUES.donation_tier_1; // £1 = 2 points
      }
    }

    const finalPoints = Math.round(amount * pointsPerPound);

    await this.awardPoints(
      userId,
      isRecurring ? 'recurring_donation' : 'donation',
      finalPoints,
      `Donated £${amount}${isRecurring ? ' (recurring)' : ''}${isMatching ? ' (matching)' : ''} - Tier ${pointsPerPound}x`,
      {
        amount,
        is_recurring: isRecurring,
        is_matching: isMatching,
        points_per_pound: pointsPerPound,
        tier: pointsPerPound
      },
      3,
      amount >= 500 // Require evidence for donations ≥£500
    );
  }

  // Award fundraising points with TIERED SYSTEM
  static async awardFundraisingPoints(
    userId: string,
    amountRaised: number,
    campaignId: string
  ): Promise<void> {
    // Tiered fundraising point calculation
    let pointsPerPound: number;
    
    if (amountRaised >= 10000) {
      pointsPerPound = ENHANCED_POINT_VALUES.fundraiser_tier_4; // £1 = 5 points
    } else if (amountRaised >= 2500) {
      pointsPerPound = ENHANCED_POINT_VALUES.fundraiser_tier_3; // £1 = 4 points
    } else if (amountRaised >= 500) {
      pointsPerPound = ENHANCED_POINT_VALUES.fundraiser_tier_2; // £1 = 3 points
    } else {
      pointsPerPound = ENHANCED_POINT_VALUES.fundraiser_tier_1; // £1 = 2 points
    }

    const finalPoints = Math.round(amountRaised * pointsPerPound);

    await this.awardPoints(
      userId,
      'fundraiser_raised',
      finalPoints,
      `Raised £${amountRaised} for campaign - Tier ${pointsPerPound}x`,
      {
        amount_raised: amountRaised,
        campaign_id: campaignId,
        points_per_pound: pointsPerPound,
        tier: pointsPerPound
      },
      5, // High effort level for fundraising
      amountRaised >= 1000 // Require evidence for £1000+
    );
  }

  // Award premium subscription points
  static async awardPremiumSubscriptionPoints(
    userId: string,
    subscriptionType: 'monthly' | 'quarterly' | 'annual' | 'vip',
    subscriptionId: string
  ): Promise<void> {
    const pointsMap = {
      monthly: ENHANCED_POINT_VALUES.premium_monthly,      // 500 points
      quarterly: ENHANCED_POINT_VALUES.premium_quarterly,  // 1800 points
      annual: ENHANCED_POINT_VALUES.premium_annual,        // 7000 points
      vip: ENHANCED_POINT_VALUES.premium_vip               // 15000 points
    };

    const points = pointsMap[subscriptionType];

    await this.awardPoints(
      userId,
      `premium_${subscriptionType}`,
      points,
      `Premium ${subscriptionType} subscription activated`,
      {
        subscription_type: subscriptionType,
        subscription_id: subscriptionId
      },
      5, // High effort/value
      false // No evidence needed - verified by payment
    );
  }
}
