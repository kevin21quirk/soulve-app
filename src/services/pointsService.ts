
import { PointCategory, PointTransaction, PointsSystemConfig, TrustLevel, PointBreakdown } from "@/types/gamification";

export const POINTS_CONFIG: PointsSystemConfig = {
  basePointValues: {
    help_completed: 25,
    emergency_help: 100,
    recurring_help: 25,
    group_help: 30,
    donation: 1, // per £1
    recurring_donation: 1, // per £1 (gets 25% bonus)
    fundraiser_created: 25,
    fundraiser_raised: 0.5, // per £1 raised
    matching_donation: 1, // per £1 (gets 1.5x multiplier)
    profile_verification: 50,
    crb_check: 100,
    verification_anniversary: 25,
    positive_feedback: 10,
    user_referral: 25,
    community_group_created: 50,
    community_event_organized: 50,
    ambassador_activity: 75
  },
  multipliers: {
    recurring_bonus: 0.25,
    consistency_bonus: 0.10,
    group_help_multiplier: 0.05,
    matching_donation_multiplier: 1.5,
    recurring_donation_bonus: 0.25
  },
  trustLevels: [
    {
      level: "new_user",
      name: "New User",
      minPoints: 0,
      color: "gray",
      benefits: ["Basic platform access"]
    },
    {
      level: "verified_helper",
      name: "Verified Helper",
      minPoints: 100,
      color: "blue",
      benefits: ["Profile verification badge", "Priority in help matching"]
    },
    {
      level: "trusted_helper",
      name: "Trusted Helper", 
      minPoints: 500,
      color: "green",
      benefits: ["Enhanced visibility", "Advanced matching features"]
    },
    {
      level: "community_leader",
      name: "Community Leader",
      minPoints: 1000,
      color: "purple",
      benefits: ["Leadership badge", "Community event creation", "Mentorship opportunities"]
    },
    {
      level: "impact_champion",
      name: "Impact Champion",
      minPoints: 5000,
      color: "gold",
      benefits: ["Champion status", "Premium features", "Recognition events", "Special rewards"]
    }
  ],
  cooldownPeriods: {
    help_completed: 0,
    emergency_help: 0,
    recurring_help: 0,
    group_help: 0,
    donation: 0,
    recurring_donation: 0,
    fundraiser_created: 1440, // 24 hours
    fundraiser_raised: 0,
    matching_donation: 0,
    profile_verification: 0,
    crb_check: 0,
    verification_anniversary: 525600, // 1 year
    positive_feedback: 60, // 1 hour per person
    user_referral: 0,
    community_group_created: 1440, // 24 hours
    community_event_organized: 720, // 12 hours
    ambassador_activity: 0
  },
  verificationThresholds: {
    large_transaction: 1000,
    manual_review: 500
  }
};

export class PointsCalculator {
  static calculatePoints(
    category: PointCategory,
    baseAmount: number = 1,
    metadata: Record<string, any> = {}
  ): { points: number; multiplier: number; description: string } {
    const basePoints = POINTS_CONFIG.basePointValues[category] * baseAmount;
    let multiplier = 1;
    let description = "";

    switch (category) {
      case "help_completed":
        // Base points for help completion
        description = `Completed help request`;
        break;

      case "recurring_help":
        // Check for consistency bonus (5+ consecutive helps)
        if (metadata.consecutiveHelps >= 5) {
          multiplier += POINTS_CONFIG.multipliers.consistency_bonus;
          description = `Recurring help with consistency bonus (${metadata.consecutiveHelps} consecutive)`;
        } else {
          description = `Recurring help assistance`;
        }
        break;

      case "group_help":
        // Multiplier for each additional helper
        const additionalHelpers = metadata.additionalHelpers || 0;
        multiplier += additionalHelpers * POINTS_CONFIG.multipliers.group_help_multiplier;
        description = `Group help event with ${additionalHelpers + 1} helpers`;
        break;

      case "donation":
        description = `Donation of £${baseAmount}`;
        break;

      case "recurring_donation":
        multiplier += POINTS_CONFIG.multipliers.recurring_donation_bonus;
        description = `Recurring donation of £${baseAmount} (25% bonus)`;
        break;

      case "matching_donation":
        multiplier = POINTS_CONFIG.multipliers.matching_donation_multiplier;
        description = `Matching donation of £${baseAmount} (1.5x multiplier)`;
        break;

      case "fundraiser_raised":
        description = `Fundraiser raised £${baseAmount}`;
        break;

      case "positive_feedback":
        // Points based on rating quality (5-15 points)
        const rating = metadata.rating || 5;
        const ratingPoints = Math.max(5, Math.min(15, rating * 3));
        description = `Received ${rating}-star rating`;
        return {
          points: ratingPoints,
          multiplier: 1,
          description
        };

      case "user_referral":
        description = `Referred new user who completed verification`;
        break;

      case "ambassador_activity":
        // Custom multiplier for ambassador activities
        multiplier = metadata.ambassadorMultiplier || 1;
        description = `Ambassador activity: ${metadata.activityType || 'General'}`;
        break;

      default:
        description = this.getCategoryDisplayName(category);
    }

    return {
      points: Math.round(basePoints * multiplier),
      multiplier,
      description
    };
  }

  static getCategoryDisplayName(category: PointCategory): string {
    const names: Record<PointCategory, string> = {
      help_completed: "Help Completed",
      emergency_help: "Emergency Assistance",
      recurring_help: "Recurring Help",
      group_help: "Group Help Event",
      donation: "Donation",
      recurring_donation: "Recurring Donation",
      fundraiser_created: "Fundraiser Created",
      fundraiser_raised: "Fundraiser Success",
      matching_donation: "Matching Donation",
      profile_verification: "Profile Verification",
      crb_check: "CRB Check Completed",
      verification_anniversary: "Verification Anniversary",
      positive_feedback: "Positive Feedback",
      user_referral: "User Referral",
      community_group_created: "Community Group Created",
      community_event_organized: "Community Event Organized",
      ambassador_activity: "Ambassador Activity"
    };
    return names[category] || category;
  }

  static getTrustLevel(totalPoints: number): TrustLevel {
    const levels = POINTS_CONFIG.trustLevels
      .sort((a, b) => b.minPoints - a.minPoints);
    
    for (const level of levels) {
      if (totalPoints >= level.minPoints) {
        return level.level;
      }
    }
    
    return "new_user";
  }

  static getTrustLevelConfig(level: TrustLevel) {
    return POINTS_CONFIG.trustLevels.find(l => l.level === level);
  }

  static getNextTrustLevel(currentPoints: number): { level: TrustLevel; pointsNeeded: number } | null {
    const currentLevel = this.getTrustLevel(currentPoints);
    const allLevels = POINTS_CONFIG.trustLevels.sort((a, b) => a.minPoints - b.minPoints);
    const currentIndex = allLevels.findIndex(l => l.level === currentLevel);
    
    if (currentIndex < allLevels.length - 1) {
      const nextLevel = allLevels[currentIndex + 1];
      return {
        level: nextLevel.level,
        pointsNeeded: nextLevel.minPoints - currentPoints
      };
    }
    
    return null;
  }

  static createPointTransaction(
    userId: string,
    category: PointCategory,
    amount: number = 1,
    metadata: Record<string, any> = {},
    relatedEntityId?: string
  ): PointTransaction {
    const calculation = this.calculatePoints(category, amount, metadata);
    
    return {
      id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      category,
      points: calculation.points,
      multiplier: calculation.multiplier,
      basePoints: POINTS_CONFIG.basePointValues[category] * amount,
      description: calculation.description,
      timestamp: new Date().toISOString(),
      verified: this.shouldAutoVerify(category, calculation.points),
      relatedEntityId,
      metadata
    };
  }

  static shouldAutoVerify(category: PointCategory, points: number): boolean {
    // Auto-verify smaller transactions, require manual review for large ones
    if (points >= POINTS_CONFIG.verificationThresholds.manual_review) {
      return false;
    }
    
    // Emergency help and large donations need verification
    if (category === "emergency_help" || 
        (category === "donation" && points >= 100)) {
      return false;
    }
    
    return true;
  }

  static calculatePointBreakdown(transactions: PointTransaction[]): PointBreakdown[] {
    const breakdown = new Map<PointCategory, PointBreakdown>();
    
    transactions.forEach(transaction => {
      if (!breakdown.has(transaction.category)) {
        breakdown.set(transaction.category, {
          category: transaction.category,
          categoryName: this.getCategoryDisplayName(transaction.category),
          totalPoints: 0,
          transactionCount: 0,
          icon: this.getCategoryIcon(transaction.category),
          color: this.getCategoryColor(transaction.category)
        });
      }
      
      const entry = breakdown.get(transaction.category)!;
      entry.totalPoints += transaction.points;
      entry.transactionCount += 1;
      
      if (!entry.lastActivity || transaction.timestamp > entry.lastActivity) {
        entry.lastActivity = transaction.timestamp;
      }
    });
    
    return Array.from(breakdown.values())
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  static getCategoryIcon(category: PointCategory): string {
    const icons: Record<PointCategory, string> = {
      help_completed: "🤝",
      emergency_help: "🚨",
      recurring_help: "🔄",
      group_help: "👥",
      donation: "💝",
      recurring_donation: "💖",
      fundraiser_created: "🎯",
      fundraiser_raised: "💰",
      matching_donation: "🎁",
      profile_verification: "✅",
      crb_check: "🛡️",
      verification_anniversary: "🎂",
      positive_feedback: "⭐",
      user_referral: "👋",
      community_group_created: "🏘️",
      community_event_organized: "🎉",
      ambassador_activity: "👑"
    };
    return icons[category] || "🎯";
  }

  static getCategoryColor(category: PointCategory): string {
    const colors: Record<PointCategory, string> = {
      help_completed: "blue",
      emergency_help: "red",
      recurring_help: "green",
      group_help: "purple",
      donation: "pink",
      recurring_donation: "rose",
      fundraiser_created: "orange",
      fundraiser_raised: "yellow",
      matching_donation: "emerald",
      profile_verification: "cyan",
      crb_check: "indigo",
      verification_anniversary: "violet",
      positive_feedback: "amber",
      user_referral: "lime",
      community_group_created: "teal",
      community_event_organized: "fuchsia",
      ambassador_activity: "gold"
    };
    return colors[category] || "gray";
  }
}
