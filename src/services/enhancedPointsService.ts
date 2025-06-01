
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
        evidence_submitted: !needsEvidence, // Auto-true if no evidence needed
        risk_score: riskScore,
        auto_verified: riskScore < 5.0 && !needsEvidence,
        verified: riskScore < 5.0 && !needsEvidence
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

    // Check recent activity patterns
    const { data: recentActivities } = await supabase
      .from('impact_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentActivities) {
      const todayPoints = recentActivities.reduce((sum, act) => sum + act.points_earned, 0);
      const sameTypeCount = recentActivities.filter(act => act.activity_type === activityType).length;
      
      // High points in short time
      if (todayPoints + points > DEFAULT_FRAUD_CONFIG.pointBurstThreshold) {
        riskScore += 8.0;
      }
      
      // Repetitive actions
      if (sameTypeCount > 5) {
        riskScore += 6.0;
      }
      
      // Rapid succession
      if (recentActivities.length > 10) {
        riskScore += 4.0;
      }
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
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as EnhancedImpactMetrics | null;
  }

  // Get user's trust domains
  static async getUserTrustDomains(userId: string): Promise<TrustDomain[]> {
    const { data, error } = await supabase
      .from('trust_domains')
      .select('*')
      .eq('user_id', userId)
      .order('domain_score', { ascending: false });

    if (error) throw error;
    return data as TrustDomain[];
  }

  // Get user's red flags
  static async getUserRedFlags(userId: string): Promise<RedFlag[]> {
    const { data, error } = await supabase
      .from('red_flags')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as RedFlag[];
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

  // Calculate trust tier from points
  static getTrustTier(points: number) {
    const tiers = [
      { name: 'Impact Champion', min: 5000, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      { name: 'Community Leader', min: 1000, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      { name: 'Trusted Helper', min: 500, color: 'text-green-600', bgColor: 'bg-green-100' },
      { name: 'Verified Helper', min: 100, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      { name: 'Basic Member', min: 0, color: 'text-gray-600', bgColor: 'bg-gray-100' }
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

  // Award donation points (£1 = 1 point)
  static async awardDonationPoints(
    userId: string,
    amount: number,
    isRecurring: boolean = false,
    isMatching: boolean = false
  ): Promise<void> {
    let pointsPerPound = ENHANCED_POINT_VALUES.donation;
    
    if (isMatching) {
      pointsPerPound = ENHANCED_POINT_VALUES.matching_donation;
    } else if (isRecurring) {
      pointsPerPound = ENHANCED_POINT_VALUES.recurring_donation;
    }

    const finalPoints = Math.round(amount * pointsPerPound);

    await this.awardPoints(
      userId,
      isRecurring ? 'recurring_donation' : 'donation',
      finalPoints,
      `Donated £${amount}${isRecurring ? ' (recurring)' : ''}${isMatching ? ' (matching)' : ''}`,
      {
        amount,
        is_recurring: isRecurring,
        is_matching: isMatching,
        points_per_pound: pointsPerPound
      },
      3,
      amount >= 100 // Require evidence for donations ≥£100
    );
  }
}
