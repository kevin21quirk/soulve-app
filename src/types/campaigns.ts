
export interface CampaignData {
  id: string;
  title: string;
  description: string;
  category: 'emergency-relief' | 'education' | 'environment' | 'healthcare' | 'community-development' | 'disaster-relief' | 'social-justice' | 'animal-welfare';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  timeframe: string;
  goal: string;
  progress: number;
  participantCount: number;
  timeLeft: string;
  impact: string;
  organizer: string;
  tags: string[];
  isParticipating: boolean;
}

// Export as Campaign for backward compatibility
export type Campaign = CampaignData;
