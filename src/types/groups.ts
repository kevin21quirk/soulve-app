
export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: 'mutual-aid' | 'skills-sharing' | 'environment' | 'community-organizing' | 'social-support' | 'advocacy' | 'education' | 'health-wellness';
  memberCount: number;
  location: string;
  activity: 'Very Active' | 'Active' | 'Moderate' | 'Low';
  recentActivity: string;
  coverImage: string;
  tags: string[];
  isPrivate: boolean;
  adminId: string;
}
