
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  startDate: string;
  endDate: string;
  targetValue: number;
  currentProgress: number;
  unit: string;
  participants: number;
  maxParticipants?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  creatorId: string;
  creatorName: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  image?: string;
  tags: string[];
  requirements?: ChallengeRequirement[];
  rewards: ChallengeReward[];
  teams?: Team[];
  isTeamBased: boolean;
  minTrustScore?: number;
}

export type ChallengeType = 'individual' | 'team' | 'community';
export type ChallengeCategory = 'environment' | 'education' | 'health' | 'community' | 'fundraising' | 'volunteer';

export interface ChallengeRequirement {
  type: 'trust_score' | 'verification' | 'location' | 'age';
  value: string | number;
  description: string;
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'certificate' | 'voucher';
  value: string | number;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  captain: string;
  progress: number;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  userName: string;
  avatar: string;
  joinedAt: string;
  contribution: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  category: string;
  startDate: string;
  endDate: string;
  location: EventLocation;
  capacity: number;
  attendees: number;
  organizerId: string;
  organizerName: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
  tags: string[];
  requirements?: ChallengeRequirement[];
  cost?: number;
  currency?: string;
  agenda?: EventAgendaItem[];
  materials?: string[];
  minTrustScore?: number;
}

export type EventType = 'fundraiser' | 'volunteer' | 'workshop' | 'meetup' | 'campaign' | 'awareness';

export interface EventLocation {
  type: 'physical' | 'virtual' | 'hybrid';
  address?: string;
  city?: string;
  country?: string;
  virtualLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventAgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

export interface UserProgress {
  userId: string;
  challengeId?: string;
  eventId?: string;
  progress: number;
  lastUpdated: string;
  milestones: ProgressMilestone[];
}

export interface ProgressMilestone {
  id: string;
  value: number;
  achievedAt: string;
  reward?: ChallengeReward;
}
