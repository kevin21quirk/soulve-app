
export interface TrustActivity {
  id: string;
  type: "donation" | "volunteer" | "help_provided" | "help_received" | "charity_support";
  title: string;
  description: string;
  organization?: string;
  amount?: number;
  date: string;
  status: "completed" | "ongoing" | "verified";
  impact?: string;
  recipients?: number;
  hours?: number;
}

export interface TrustFootprint {
  userId: string;
  userName: string;
  trustScore: number;
  totalActivities: number;
  totalDonated: number;
  totalVolunteerHours: number;
  helpProvidedCount: number;
  helpReceivedCount: number;
  charitiesSupported: number;
  activities: TrustActivity[];
  verificationBadges: string[];
}
