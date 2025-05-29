
export interface ImpactMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface HelpActivityData {
  week: string;
  helped: number;
  received: number;
}

export interface EngagementData {
  day: string;
  posts: number;
  likes: number;
  comments: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface CampaignAnalytics {
  id: string;
  campaignId: string;
  date: string;
  totalViews: number;
  uniqueViews: number;
  totalDonations: number;
  donationAmount: number;
  socialShares: number;
  commentCount: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDonation {
  id: string;
  campaignId: string;
  donorId?: string;
  amount: number;
  currency: string;
  donationType: 'one_time' | 'recurring' | 'anonymous';
  source?: string;
  referrerUrl?: string;
  deviceType?: string;
  locationCountry?: string;
  locationCity?: string;
  paymentProcessor: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  isAnonymous: boolean;
  donorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignEngagement {
  id: string;
  campaignId: string;
  userId?: string;
  actionType: 'view' | 'share' | 'like' | 'comment' | 'bookmark' | 'report';
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrerUrl?: string;
  timeSpent?: number;
  deviceType?: string;
  locationCountry?: string;
  locationCity?: string;
  createdAt: string;
}

export interface CampaignSocialMetric {
  id: string;
  campaignId: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'email';
  metricType: 'share' | 'like' | 'comment' | 'mention' | 'reach' | 'impression';
  value: number;
  date: string;
  externalPostId?: string;
  createdAt: string;
}

export interface CampaignGeographicImpact {
  id: string;
  campaignId: string;
  countryCode: string;
  countryName: string;
  city?: string;
  region?: string;
  totalDonations: number;
  donorCount: number;
  totalViews: number;
  totalShares: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignPrediction {
  id: string;
  campaignId: string;
  predictionType: 'goal_completion' | 'daily_donations' | 'viral_potential' | 'optimal_timing';
  predictedValue: number;
  confidenceScore: number;
  predictionDate: string;
  actualValue?: number;
  modelVersion?: string;
  createdAt: string;
}

export interface AnalyticsTrackingOptions {
  campaignId: string;
  userId?: string;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  ip?: string;
  locationCountry?: string;
  locationCity?: string;
  platform?: string;
}
