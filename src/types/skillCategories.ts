export interface SkillCategory {
  id: string;
  name: string;
  category: string;
  market_rate_gbp: number;
  requires_verification: boolean;
  evidence_required: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerActivity {
  skillCategoryId: string;
  hours: number;
  marketRate: number;
  marketValue: number;
  points: number;
  description: string;
  organization?: string;
  evidenceUrl?: string;
}

export const POINTS_CONVERSION_RATE = 0.5; // £1 market value = 0.5 points
export const MAX_WEEKLY_HOURS = 40; // Maximum hours per skill per week
