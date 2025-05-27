
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
