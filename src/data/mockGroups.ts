
import { CommunityGroup } from "@/types/groups";

export const mockGroups: CommunityGroup[] = [
  {
    id: '1',
    name: 'London Mutual Aid Network',
    description: 'Community-driven support network helping neighbors with everyday needs and emergency assistance.',
    category: 'mutual-aid',
    memberCount: 1250,
    location: 'London',
    activity: 'Very Active',
    recentActivity: 'New post 2 hours ago',
    coverImage: '',
    tags: ['mutual-aid', 'emergency-help', 'community-support'],
    isPrivate: false,
    adminId: 'admin1'
  },
  {
    id: '2',
    name: 'Tech Skills Exchange',
    description: 'Share and learn technical skills. From coding to digital literacy, we help each other grow.',
    category: 'skills-sharing',
    memberCount: 890,
    location: 'Manchester',
    activity: 'Active',
    recentActivity: 'Workshop scheduled for tomorrow',
    coverImage: '',
    tags: ['technology', 'skills-sharing', 'education'],
    isPrivate: false,
    adminId: 'admin2'
  },
  {
    id: '3',
    name: 'Birmingham Community Garden',
    description: 'Growing together! Join us in maintaining our community garden and learning sustainable practices.',
    category: 'environment',
    memberCount: 340,
    location: 'Birmingham',
    activity: 'Active',
    recentActivity: 'Planting event this weekend',
    coverImage: '',
    tags: ['gardening', 'sustainability', 'environment'],
    isPrivate: false,
    adminId: 'admin3'
  }
];
