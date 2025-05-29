
import { UserVerification } from "@/types/verification";

export interface TrustLevel {
  level: string;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  benefits: string[];
}

export interface TrustMilestone {
  nextLevel: string;
  pointsNeeded: number;
  suggestions: string[];
}

export class TrustScoreCalculator {
  private static trustLevels: TrustLevel[] = [
    {
      level: "new_user",
      name: "New User",
      minScore: 0,
      maxScore: 29,
      color: "text-gray-500",
      description: "Welcome to the community! Complete your first verification to start building trust.",
      benefits: [
        "Basic platform access",
        "Limited help requests per day",
        "Community forum participation"
      ]
    },
    {
      level: "verified_helper",
      name: "Verified Helper",
      minScore: 30,
      maxScore: 59,
      color: "text-blue-500",
      description: "You've started building trust! Keep engaging to unlock more features.",
      benefits: [
        "Increased help request limits",
        "Profile verification badge",
        "Priority in search results",
        "Access to community events"
      ]
    },
    {
      level: "trusted_helper",
      name: "Trusted Helper",
      minScore: 60,
      maxScore: 79,
      color: "text-green-500",
      description: "You're a trusted community member with proven reliability.",
      benefits: [
        "Unlimited help requests",
        "Advanced matching preferences",
        "Ability to mentor new users",
        "Early access to new features",
        "Enhanced profile visibility"
      ]
    },
    {
      level: "community_leader",
      name: "Community Leader",
      minScore: 80,
      maxScore: 94,
      color: "text-purple-500",
      description: "An exemplary community member who leads by example.",
      benefits: [
        "Community moderation tools",
        "Group creation privileges",
        "Featured helper status",
        "Direct support channel",
        "Beta feature testing access"
      ]
    },
    {
      level: "impact_champion",
      name: "Impact Champion",
      minScore: 95,
      maxScore: 100,
      color: "text-yellow-500",
      description: "The highest level of trust - a true champion of community impact.",
      benefits: [
        "All platform privileges",
        "Advisory board invitation",
        "Custom verification badges",
        "Speaking opportunities",
        "Platform partnership benefits"
      ]
    }
  ];

  static getTrustLevel(score: number): TrustLevel {
    return this.trustLevels.find(level => 
      score >= level.minScore && score <= level.maxScore
    ) || this.trustLevels[0];
  }

  static getTrustLevelConfig(level: string): TrustLevel | undefined {
    return this.trustLevels.find(tl => tl.level === level);
  }

  static getNextMilestone(currentScore: number): TrustMilestone | null {
    const currentLevel = this.getTrustLevel(currentScore);
    const currentIndex = this.trustLevels.findIndex(level => level.level === currentLevel.level);
    
    if (currentIndex === this.trustLevels.length - 1) {
      return null; // Already at max level
    }

    const nextLevel = this.trustLevels[currentIndex + 1];
    const pointsNeeded = nextLevel.minScore - currentScore;

    const suggestions = this.getSuggestions(currentScore, nextLevel.minScore);

    return {
      nextLevel: nextLevel.level,
      pointsNeeded,
      suggestions
    };
  }

  private static getSuggestions(currentScore: number, targetScore: number): string[] {
    const gap = targetScore - currentScore;
    const suggestions = [];

    if (gap <= 10) {
      suggestions.push("Complete email verification (+5 points)");
      suggestions.push("Add a profile photo (+3 points)");
      suggestions.push("Complete your bio (+2 points)");
    } else if (gap <= 20) {
      suggestions.push("Complete phone verification (+10 points)");
      suggestions.push("Connect social media accounts (+5 points)");
      suggestions.push("Help your first community member (+15 points)");
    } else {
      suggestions.push("Complete government ID verification (+20 points)");
      suggestions.push("Get organization verification (+25 points)");
      suggestions.push("Complete background check (+30 points)");
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  static calculateScore(verifications: UserVerification[]): number {
    let baseScore = 50; // Starting score
    
    const approvedVerifications = verifications.filter(v => v.status === 'approved');
    
    // Points for different verification types
    const verificationPoints: Record<string, number> = {
      'email': 5,
      'phone': 10,
      'government_id': 20,
      'organization': 25,
      'community_leader': 15,
      'expert': 20,
      'background_check': 30
    };

    let verificationScore = 0;
    approvedVerifications.forEach(verification => {
      verificationScore += verificationPoints[verification.verification_type] || 0;
    });

    // Bonus for multiple verifications
    if (approvedVerifications.length >= 3) {
      verificationScore += 10; // Consistency bonus
    }
    if (approvedVerifications.length >= 5) {
      verificationScore += 15; // Commitment bonus
    }

    const finalScore = Math.min(baseScore + verificationScore, 100);
    return finalScore;
  }

  static getVerificationRecommendations(currentVerifications: UserVerification[]): string[] {
    const completed = currentVerifications
      .filter(v => v.status === 'approved')
      .map(v => v.verification_type);

    const recommendations = [];

    if (!completed.includes('email')) {
      recommendations.push('Email verification - Quick and essential (+5 points)');
    }
    if (!completed.includes('phone')) {
      recommendations.push('Phone verification - Adds security (+10 points)');
    }
    if (!completed.includes('government_id')) {
      recommendations.push('Government ID - High trust boost (+20 points)');
    }
    if (!completed.includes('organization')) {
      recommendations.push('Organization verification - Professional credibility (+25 points)');
    }

    return recommendations.slice(0, 4);
  }
}
