
export interface ConnectionRequest {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  mutualConnections: number;
  helpedPeople: number;
  location: string;
  bio: string;
  status: "pending" | "sent" | "connected" | "declined";
  skills: string[];
  joinedDate: string;
  lastActive: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isJoined: boolean;
  location?: string;
  tags: string[];
  lastActivity: string;
  adminName: string;
  adminAvatar: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  organizer: string;
  organizerAvatar: string;
  coverImage: string;
  participantCount: number;
  goalAmount?: number;
  currentAmount?: number;
  endDate: string;
  location: string;
  category: "fundraising" | "volunteer" | "awareness" | "community";
  tags: string[];
  isParticipating: boolean;
  urgency: "low" | "medium" | "high";
}

export interface PeopleYouMayKnow {
  id: string;
  name: string;
  avatar: string;
  mutualConnections: number;
  reason: string;
  location: string;
  workPlace?: string;
  school?: string;
}
