
export interface RedemptionReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'badges' | 'perks' | 'donations' | 'merchandise';
  icon: string;
  available: boolean;
  stock?: number;
  requiredTrustLevel?: number;
}

export interface RedemptionTransaction {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  status: 'pending' | 'completed' | 'failed';
  redeemedAt: string;
}

export class PointRedemptionService {
  private static rewards: RedemptionReward[] = [
    {
      id: 'profile_badge_gold',
      title: 'Gold Helper Badge',
      description: 'Display a gold badge on your profile',
      pointsCost: 500,
      category: 'badges',
      icon: '🥇',
      available: true,
      requiredTrustLevel: 2
    },
    {
      id: 'priority_matching',
      title: 'Priority Matching',
      description: 'Get priority in help request matching for 30 days',
      pointsCost: 300,
      category: 'perks',
      icon: '⚡',
      available: true
    },
    {
      id: 'community_donation',
      title: 'Community Food Bank Donation',
      description: 'We\'ll donate £10 to local food bank on your behalf',
      pointsCost: 200,
      category: 'donations',
      icon: '🍞',
      available: true,
      stock: 50
    },
    {
      id: 'eco_tote_bag',
      title: 'SouLVE Eco Tote Bag',
      description: 'Sustainable tote bag made from recycled materials',
      pointsCost: 800,
      category: 'merchandise',
      icon: '👜',
      available: true,
      stock: 25,
      requiredTrustLevel: 3
    },
    {
      id: 'monthly_spotlight',
      title: 'Monthly Community Spotlight',
      description: 'Feature your story in our monthly newsletter',
      pointsCost: 1000,
      category: 'perks',
      icon: '⭐',
      available: true,
      requiredTrustLevel: 4
    }
  ];

  private static transactions: RedemptionTransaction[] = [];

  static getAvailableRewards(userTrustLevel: number): RedemptionReward[] {
    return this.rewards.filter(reward => 
      reward.available && 
      (!reward.requiredTrustLevel || userTrustLevel >= reward.requiredTrustLevel) &&
      (!reward.stock || reward.stock > 0)
    );
  }

  static getRewardsByCategory(category: RedemptionReward['category']): RedemptionReward[] {
    return this.rewards.filter(reward => reward.category === category && reward.available);
  }

  static async redeemReward(
    userId: string, 
    rewardId: string, 
    userPoints: number,
    userTrustLevel: number
  ): Promise<{ success: boolean; message: string; transaction?: RedemptionTransaction }> {
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }

    if (!reward.available) {
      return { success: false, message: 'Reward no longer available' };
    }

    if (reward.requiredTrustLevel && userTrustLevel < reward.requiredTrustLevel) {
      return { success: false, message: `Requires trust level ${reward.requiredTrustLevel}` };
    }

    if (userPoints < reward.pointsCost) {
      return { success: false, message: 'Insufficient points' };
    }

    if (reward.stock && reward.stock <= 0) {
      return { success: false, message: 'Out of stock' };
    }

    // Create transaction
    const transaction: RedemptionTransaction = {
      id: `redemption-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      status: 'completed',
      redeemedAt: new Date().toISOString()
    };

    this.transactions.push(transaction);

    // Update stock
    if (reward.stock) {
      reward.stock -= 1;
    }

    return { 
      success: true, 
      message: `Successfully redeemed ${reward.title}!`,
      transaction
    };
  }

  static getUserTransactions(userId: string): RedemptionTransaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  static getTotalPointsSpent(userId: string): number {
    return this.getUserTransactions(userId)
      .filter(t => t.status === 'completed')
      .reduce((total, t) => total + t.pointsSpent, 0);
  }
}
