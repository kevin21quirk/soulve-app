
export interface Recommendation {
  id: string;
  type: "connection" | "post" | "help_opportunity" | "skill_match";
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionLabel: string;
  data: any;
}
