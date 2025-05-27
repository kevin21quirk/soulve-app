
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  helpedCount: number;
  connectionsCount: number;
  postsCount: number;
  likesReceived: number;
}
