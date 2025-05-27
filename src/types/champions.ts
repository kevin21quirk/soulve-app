
export interface CommunityChampion {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  trustScore: number;
  trustLevel: "verified_helper" | "trusted_helper" | "community_leader" | "impact_champion";
  helpedCount: number;
  specialties: string[];
  bio: string;
  badges: ChampionBadge[];
  isVerified: boolean;
  joinedDate: string;
  totalImpactPoints: number;
  recentAchievement?: string;
}

export interface ChampionBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
