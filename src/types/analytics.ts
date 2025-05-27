
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
