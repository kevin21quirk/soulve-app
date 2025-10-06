
interface TrustLevel {
  level: string;
  name: string;
  color: string;
  description: string;
  benefits: string[];
  minScore: number;
  maxScore: number;
}

interface TrustMilestone {
  nextLevel: string;
  pointsNeeded: number;
  suggestions: string[];
}

export class TrustScoreCalculator {
  private static trustLevels: TrustLevel[] = [
    {
      level: 'new_user',
      name: 'New Member',
      color: 'text-gray-600',
      description: 'Welcome to the community! Complete your profile and start building trust.',
      benefits: [
        'Access to basic community features',
        'Ability to create help requests',
        'Join public groups'
      ],
      minScore: 0,
      maxScore: 39
    },
    {
      level: 'verified_helper',
      name: 'Verified Helper',
      color: 'text-blue-600',
      description: 'You\'ve verified your identity and started helping others.',
      benefits: [
        'Enhanced profile visibility',
        'Access to volunteer opportunities',
        'Priority in help matching',
        'Ability to join private groups'
      ],
      minScore: 40,
      maxScore: 59
    },
    {
      level: 'trusted_helper',
      name: 'Trusted Helper',
      color: 'text-green-600',
      description: 'A reliable community member with proven track record.',
      benefits: [
        'Featured in helper recommendations',
        'Access to exclusive events',
        'Mentorship opportunities',
        'Advanced reporting tools'
      ],
      minScore: 60,
      maxScore: 79
    },
    {
      level: 'community_leader',
      name: 'Community Leader',
      color: 'text-purple-600',
      description: 'A respected leader who makes significant community impact.',
      benefits: [
        'Ability to create community groups',
        'Event organization privileges',
        'Verification team access',
        'Community moderation tools'
      ],
      minScore: 80,
      maxScore: 94
    },
    {
      level: 'impact_champion',
      name: 'Impact Champion',
      color: 'text-yellow-600',
      description: 'An exceptional community member driving positive change.',
      benefits: [
        'Platform ambassador status',
        'Policy influence opportunities',
        'Advanced analytics access',
        'Special recognition features'
      ],
      minScore: 95,
      maxScore: 100
    }
  ];

  static getTrustLevel(score: number): TrustLevel {
    return this.trustLevels.find(level => 
      score >= level.minScore && score <= level.maxScore
    ) || this.trustLevels[0];
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
      nextLevel: nextLevel.name,
      pointsNeeded,
      suggestions
    };
  }

  private static getSuggestions(currentScore: number, targetScore: number): string[] {
    const gap = targetScore - currentScore;
    const suggestions: string[] = [];

    if (gap > 20) {
      suggestions.push('Complete ID verification (+25 points)');
      suggestions.push('Verify 2-3 professional skills (+10 points each)');
      suggestions.push('Help 3-5 community members (+5 points each)');
    } else if (gap > 10) {
      suggestions.push('Complete phone verification (+5 points)');
      suggestions.push('Join and participate in community groups (+3 points)');
      suggestions.push('Maintain consistent helping activity (+2 points weekly)');
    } else {
      suggestions.push('Continue regular community participation');
      suggestions.push('Maintain high ratings from help recipients');
      suggestions.push('Complete additional skill verifications');
    }

    return suggestions.slice(0, 3);
  }

  static calculateTrustScore(verifications: any[], activities: any[], ratings: number[]): number {
    let score = 50; // Base score

    // Verification bonuses
    const verificationBonuses = {
      'email': 5,
      'phone': 5,
      'government_id': 25,
      'organization': 20,
      'expert': 10,
      'background_check': 15,
      'community_leader': 12
    };

    verifications.forEach(verification => {
      if (verification.status === 'approved') {
        score += verificationBonuses[verification.verification_type as keyof typeof verificationBonuses] || 0;
      }
    });

    // Activity bonuses
    const helpCount = activities.filter(a => a.activity_type === 'help_completed').length;
    const donationCount = activities.filter(a => a.activity_type === 'donation').length;
    const volunteerCount = activities.filter(a => a.activity_type === 'volunteer').length;

    score += Math.min(helpCount * 2, 20); // Max 20 points from helping
    score += Math.min(donationCount * 1, 10); // Max 10 points from donations
    score += Math.min(volunteerCount * 3, 15); // Max 15 points from volunteering

    // Rating bonus
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      score += (avgRating - 3) * 5; // +5 points per star above 3
    }

    // Cap between 0 and 100
    return Math.max(0, Math.min(score, 100));
  }

  static getVerificationImpact(verificationType: string): { points: number; description: string } {
    const impacts = {
      'email': { points: 5, description: 'Basic identity confirmation' },
      'phone': { points: 5, description: 'Contact verification' },
      'government_id': { points: 25, description: 'Official identity verification' },
      'organization': { points: 20, description: 'Institutional credibility' },
      'expert': { points: 10, description: 'Professional expertise' },
      'background_check': { points: 15, description: 'Enhanced safety verification' },
      'community_leader': { points: 12, description: 'Community recognition' }
    };

    return impacts[verificationType as keyof typeof impacts] || { points: 0, description: 'Unknown verification' };
  }

  static getTrustTrends(historicalScores: { score: number; date: string }[]): {
    trend: 'increasing' | 'decreasing' | 'stable';
    change: number;
    prediction: number;
  } {
    if (historicalScores.length < 2) {
      return { trend: 'stable', change: 0, prediction: historicalScores[0]?.score || 50 };
    }

    const recent = historicalScores.slice(-5); // Last 5 scores
    const oldestRecent = recent[0].score;
    const latestScore = recent[recent.length - 1].score;
    const change = latestScore - oldestRecent;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (change > 2) trend = 'increasing';
    else if (change < -2) trend = 'decreasing';

    // Simple prediction based on trend
    const prediction = Math.max(0, Math.min(100, latestScore + (change * 0.5)));

    return { trend, change, prediction };
  }
}
