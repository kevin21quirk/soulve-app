
import { UserVerification, VerificationType } from '@/types/verification';

export interface TrustScoreBreakdown {
  baseScore: number;
  verificationBonus: number;
  timeBonus: number;
  activityBonus: number;
  totalScore: number;
  breakdown: {
    category: string;
    points: number;
    maxPoints: number;
    description: string;
  }[];
}

export class TrustScoreCalculator {
  private static readonly BASE_SCORE = 50;
  private static readonly MAX_SCORE = 100;
  
  private static readonly VERIFICATION_POINTS: Record<VerificationType, number> = {
    email: 5,
    phone: 10,
    government_id: 25,
    organization: 15,
    community_leader: 20,
    expert: 15,
    background_check: 30
  };

  static calculateTrustScore(
    verifications: UserVerification[],
    accountAge: number = 0,
    activityScore: number = 0
  ): TrustScoreBreakdown {
    const approvedVerifications = verifications.filter(v => v.status === 'approved');
    
    // Base score
    const baseScore = this.BASE_SCORE;
    
    // Verification bonus
    const verificationBonus = approvedVerifications.reduce((total, verification) => {
      return total + (this.VERIFICATION_POINTS[verification.verification_type] || 0);
    }, 0);
    
    // Time bonus (up to 10 points for accounts older than 6 months)
    const timeBonus = Math.min(10, Math.floor(accountAge / 30) * 2);
    
    // Activity bonus (up to 15 points based on platform activity)
    const activityBonus = Math.min(15, activityScore);
    
    // Calculate total with cap
    const totalScore = Math.min(
      this.MAX_SCORE,
      baseScore + verificationBonus + timeBonus + activityBonus
    );

    // Create breakdown
    const breakdown = [
      {
        category: 'Base Score',
        points: baseScore,
        maxPoints: baseScore,
        description: 'Starting trust score for all users'
      },
      {
        category: 'Email Verification',
        points: this.getVerificationPoints(approvedVerifications, 'email'),
        maxPoints: this.VERIFICATION_POINTS.email,
        description: 'Verified email address'
      },
      {
        category: 'Phone Verification',
        points: this.getVerificationPoints(approvedVerifications, 'phone'),
        maxPoints: this.VERIFICATION_POINTS.phone,
        description: 'Verified phone number'
      },
      {
        category: 'ID Verification',
        points: this.getVerificationPoints(approvedVerifications, 'government_id'),
        maxPoints: this.VERIFICATION_POINTS.government_id,
        description: 'Government-issued ID verification'
      },
      {
        category: 'Organization Verification',
        points: this.getVerificationPoints(approvedVerifications, 'organization'),
        maxPoints: this.VERIFICATION_POINTS.organization,
        description: 'Verified organization affiliation'
      },
      {
        category: 'Expert Verification',
        points: this.getVerificationPoints(approvedVerifications, 'expert'),
        maxPoints: this.VERIFICATION_POINTS.expert,
        description: 'Professional expertise verification'
      },
      {
        category: 'Community Leader',
        points: this.getVerificationPoints(approvedVerifications, 'community_leader'),
        maxPoints: this.VERIFICATION_POINTS.community_leader,
        description: 'Community leadership recognition'
      },
      {
        category: 'Background Check',
        points: this.getVerificationPoints(approvedVerifications, 'background_check'),
        maxPoints: this.VERIFICATION_POINTS.background_check,
        description: 'Professional background verification'
      },
      {
        category: 'Account Age',
        points: timeBonus,
        maxPoints: 10,
        description: 'Bonus for established accounts'
      },
      {
        category: 'Platform Activity',
        points: activityBonus,
        maxPoints: 15,
        description: 'Bonus for active platform participation'
      }
    ];

    return {
      baseScore,
      verificationBonus,
      timeBonus,
      activityBonus,
      totalScore,
      breakdown: breakdown.filter(item => item.maxPoints > 0)
    };
  }

  private static getVerificationPoints(
    verifications: UserVerification[],
    type: VerificationType
  ): number {
    const verification = verifications.find(v => v.verification_type === type);
    return verification ? this.VERIFICATION_POINTS[type] : 0;
  }

  static getTrustLevel(score: number): {
    level: string;
    color: string;
    description: string;
    benefits: string[];
  } {
    if (score >= 90) {
      return {
        level: 'Elite',
        color: 'text-purple-600',
        description: 'Highest trust level with maximum platform benefits',
        benefits: [
          'Priority support',
          'Enhanced visibility',
          'Premium features access',
          'Exclusive opportunities',
          'Trust ambassador status'
        ]
      };
    } else if (score >= 75) {
      return {
        level: 'Trusted',
        color: 'text-green-600',
        description: 'High trust level with extensive platform access',
        benefits: [
          'Advanced features',
          'Priority matching',
          'Enhanced profile visibility',
          'Community leadership opportunities'
        ]
      };
    } else if (score >= 60) {
      return {
        level: 'Verified',
        color: 'text-blue-600',
        description: 'Good trust level with full platform access',
        benefits: [
          'All basic features',
          'Profile verification badge',
          'Community participation',
          'Standard support'
        ]
      };
    } else {
      return {
        level: 'New',
        color: 'text-gray-600',
        description: 'Starting trust level - complete verifications to unlock more features',
        benefits: [
          'Basic platform access',
          'Profile creation',
          'Limited features'
        ]
      };
    }
  }

  static getNextMilestone(currentScore: number): {
    nextLevel: string;
    pointsNeeded: number;
    suggestions: string[];
  } | null {
    if (currentScore < 60) {
      return {
        nextLevel: 'Verified',
        pointsNeeded: 60 - currentScore,
        suggestions: [
          'Complete phone verification (+10 points)',
          'Complete ID verification (+25 points)',
          'Add professional information'
        ]
      };
    } else if (currentScore < 75) {
      return {
        nextLevel: 'Trusted',
        pointsNeeded: 75 - currentScore,
        suggestions: [
          'Complete background check (+30 points)',
          'Get organization verification (+15 points)',
          'Increase platform activity'
        ]
      };
    } else if (currentScore < 90) {
      return {
        nextLevel: 'Elite',
        pointsNeeded: 90 - currentScore,
        suggestions: [
          'Become a community leader (+20 points)',
          'Get expert verification (+15 points)',
          'Maintain consistent activity'
        ]
      };
    }
    
    return null;
  }
}
