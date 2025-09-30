
import { PointCategory, PointTransaction, UserStats, TrustLevel, PointsSystemConfig } from "@/types/gamification";

export class PointsCalculator {
  private static config: PointsSystemConfig = {
    basePointValues: {
      help_completed: 25,
      emergency_help: 100,
      recurring_help: 35,
      group_help: 40,
      donation: 2,              // Base £1 = 2 points (tiered in enhanced service)
      recurring_donation: 4,    // Base £1 = 4 points for recurring
      fundraiser_created: 200,  // Creating campaign now worth 200
      fundraiser_raised: 2,     // Base £1 = 2 points (tiered in enhanced service)
      matching_donation: 8,     // Base £1 = 8 points for matching
      profile_verification: 25,
      crb_check: 100,
      verification_anniversary: 10,
      positive_feedback: 5,
      user_referral: 20,
      community_group_created: 75,
      community_event_organized: 60,
      ambassador_activity: 30
    },
    multipliers: {
      recurring_bonus: 1.5,
      consistency_bonus: 1.2,
      group_help_multiplier: 1.3,
      matching_donation_multiplier: 2.0,
      recurring_donation_bonus: 1.4
    },
    trustLevels: [
      {
        level: "new_user",
        name: "Basic Member",
        minPoints: 0,
        color: "text-gray-500",
        benefits: ["Basic platform access", "Community participation"]
      },
      {
        level: "verified_helper",
        name: "Verified Helper",
        minPoints: 100,
        color: "text-blue-500",
        benefits: ["Verified badge", "Increased visibility", "Priority matching"]
      },
      {
        level: "trusted_helper",
        name: "Trusted Helper",
        minPoints: 500,
        color: "text-green-500",
        benefits: ["Trust badge", "Advanced features", "Group creation"]
      },
      {
        level: "community_leader",
        name: "Community Leader",
        minPoints: 1000,
        color: "text-purple-500",
        benefits: ["Leadership badge", "Moderation tools", "Featured status"]
      },
      {
        level: "impact_champion",
        name: "Impact Champion",
        minPoints: 5000,
        color: "text-yellow-500",
        benefits: ["Champion badge", "Advisory access", "Partnership opportunities"]
      }
    ],
    cooldownPeriods: {
      help_completed: 0,
      emergency_help: 0,          // NO cooldown - emergencies don't wait
      recurring_help: 1440,
      group_help: 0,
      donation: 0,                // NO cooldown - unlimited donations
      recurring_donation: 0,      // NO cooldown
      fundraiser_created: 10080,  // 1 week cooldown
      fundraiser_raised: 0,       // NO cooldown - unlimited fundraising
      matching_donation: 0,       // NO cooldown
      profile_verification: 0,
      crb_check: 525600,         // 1 year cooldown
      verification_anniversary: 525600,
      positive_feedback: 60,
      user_referral: 0,          // NO cooldown - encourage viral growth
      community_group_created: 10080,
      community_event_organized: 1440,
      ambassador_activity: 1440
    },
    verificationThresholds: {
      email: 50,
      phone: 150,
      government_id: 300,
      organization: 500
    }
  };

  static calculatePoints(
    category: PointCategory,
    metadata?: Record<string, any>
  ): { points: number; multiplier: number; basePoints: number } {
    const basePoints = this.config.basePointValues[category] || 0;
    let multiplier = 1;
    
    // Apply multipliers based on category and metadata
    switch (category) {
      case 'recurring_help':
        multiplier = this.config.multipliers.recurring_bonus;
        break;
      case 'group_help':
        multiplier = this.config.multipliers.group_help_multiplier;
        break;
      case 'matching_donation':
        multiplier = this.config.multipliers.matching_donation_multiplier;
        break;
      case 'recurring_donation':
        multiplier = this.config.multipliers.recurring_donation_bonus;
        break;
    }

    // Consistency bonus for repeated activities
    if (metadata?.consecutiveDays && metadata.consecutiveDays >= 7) {
      multiplier *= this.config.multipliers.consistency_bonus;
    }

    const finalPoints = Math.round(basePoints * multiplier);
    
    return {
      points: finalPoints,
      multiplier,
      basePoints
    };
  }

  static getTrustLevel(totalPoints: number): TrustLevel {
    const levels = this.config.trustLevels.sort((a, b) => b.minPoints - a.minPoints);
    return levels.find(level => totalPoints >= level.minPoints)?.level as TrustLevel || "new_user";
  }

  static getTrustLevelConfig(level: TrustLevel) {
    return this.config.trustLevels.find(l => l.level === level);
  }

  static getNextTrustLevel(currentPoints: number): { level: TrustLevel; pointsNeeded: number } | null {
    const currentLevel = this.getTrustLevel(currentPoints);
    const currentIndex = this.config.trustLevels.findIndex(l => l.level === currentLevel);
    
    if (currentIndex === this.config.trustLevels.length - 1) {
      return null; // Already at max level
    }
    
    const nextLevel = this.config.trustLevels[currentIndex + 1];
    return {
      level: nextLevel.level as TrustLevel,
      pointsNeeded: nextLevel.minPoints - currentPoints
    };
  }

  static canAwardPoints(
    category: PointCategory,
    lastActivity?: Date
  ): boolean {
    const cooldownMinutes = this.config.cooldownPeriods[category];
    
    if (cooldownMinutes === 0 || !lastActivity) {
      return true;
    }
    
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const timeSinceLastActivity = Date.now() - lastActivity.getTime();
    
    return timeSinceLastActivity >= cooldownMs;
  }

  static calculateUserStats(transactions: PointTransaction[]): UserStats {
    const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);
    const trustLevel = this.getTrustLevel(totalPoints);
    const nextLevel = this.getNextTrustLevel(totalPoints);
    
    return {
      totalPoints,
      level: this.config.trustLevels.findIndex(l => l.level === trustLevel) + 1,
      nextLevelPoints: nextLevel?.pointsNeeded || 0,
      helpedCount: transactions.filter(t => 
        ['help_completed', 'emergency_help', 'group_help'].includes(t.category)
      ).length,
      connectionsCount: 0, // Would be calculated from connections data
      postsCount: 0, // Would be calculated from posts data
      likesReceived: 0, // Would be calculated from likes data
      trustScore: Math.min(50 + (totalPoints / 50), 100), // Convert points to trust score
      trustLevel
    };
  }
}
