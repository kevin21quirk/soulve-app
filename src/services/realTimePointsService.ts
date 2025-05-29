
import { PointsCalculator } from './pointsService';
import { PointCategory, PointTransaction } from '@/types/gamification';

export class RealTimePointsService {
  private static instance: RealTimePointsService;
  private listeners: Set<(transaction: PointTransaction) => void> = new Set();
  private animationQueue: PointTransaction[] = [];
  private isProcessing = false;

  static getInstance(): RealTimePointsService {
    if (!this.instance) {
      this.instance = new RealTimePointsService();
    }
    return this.instance;
  }

  addListener(callback: (transaction: PointTransaction) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async awardPoints(
    userId: string,
    category: PointCategory,
    description: string,
    metadata?: Record<string, any>
  ): Promise<PointTransaction> {
    const { points, multiplier, basePoints } = PointsCalculator.calculatePoints(category, metadata);
    
    const transaction: PointTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      category,
      points,
      multiplier,
      basePoints,
      description,
      timestamp: new Date().toISOString(),
      verified: true,
      relatedEntityId: metadata?.entityId
    };

    // Add to animation queue
    this.animationQueue.push(transaction);
    this.processAnimationQueue();

    // Notify all listeners
    this.listeners.forEach(callback => callback(transaction));

    return transaction;
  }

  private async processAnimationQueue() {
    if (this.isProcessing || this.animationQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.animationQueue.length > 0) {
      const transaction = this.animationQueue.shift();
      if (transaction) {
        // Trigger animation (can be customized per implementation)
        await this.animatePointsEarned(transaction);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between animations
      }
    }
    
    this.isProcessing = false;
  }

  private async animatePointsEarned(transaction: PointTransaction) {
    // This can be enhanced with actual DOM animations
    console.log(`🎉 +${transaction.points} points earned: ${transaction.description}`);
    
    // Show toast notification if available
    if (typeof window !== 'undefined' && 'dispatchEvent' in window) {
      window.dispatchEvent(new CustomEvent('pointsEarned', { detail: transaction }));
    }
  }

  // Simulate earning points for demo
  startDemo() {
    const demoActions = [
      { category: 'help_completed' as PointCategory, description: 'Helped community member with groceries' },
      { category: 'donation' as PointCategory, description: 'Donated to local food bank' },
      { category: 'positive_feedback' as PointCategory, description: 'Received 5-star rating' }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index >= demoActions.length) {
        clearInterval(interval);
        return;
      }
      
      const action = demoActions[index];
      this.awardPoints('current-user', action.category, action.description);
      index++;
    }, 3000);

    return () => clearInterval(interval);
  }
}

export const realTimePointsService = RealTimePointsService.getInstance();
