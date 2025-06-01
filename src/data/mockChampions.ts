
import { CommunityChampion } from "@/types/champions";

export const mockChampions: CommunityChampion[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    title: 'Community Organizer',
    avatar: '',
    location: 'London',
    trustScore: 98,
    trustLevel: 'impact_champion',
    helpedCount: 347,
    bio: 'Dedicated community leader with 10+ years of experience organizing mutual aid networks and emergency response initiatives.',
    specialties: ['Emergency Response', 'Community Organizing', 'Crisis Management'],
    totalImpactPoints: 15420,
    joinedDate: 'January 2019',
    isVerified: true,
    recentAchievement: 'Organized successful winter relief campaign reaching 500+ families',
    badges: [
      { id: '1', name: 'Crisis Hero', icon: '🚨', color: 'bg-red-100 text-red-700', description: 'Led 10+ emergency response efforts' },
      { id: '2', name: 'Network Builder', icon: '🌐', color: 'bg-blue-100 text-blue-700', description: 'Built connections across 5+ communities' }
    ]
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Skills Training Coordinator',
    avatar: '',
    location: 'Manchester',
    trustScore: 95,
    trustLevel: 'community_leader',
    helpedCount: 189,
    bio: 'Tech professional turned community educator, specializing in digital literacy and vocational training for underserved communities.',
    specialties: ['Digital Literacy', 'Vocational Training', 'Youth Mentoring'],
    totalImpactPoints: 8760,
    joinedDate: 'March 2020',
    isVerified: true,
    recentAchievement: 'Launched digital skills program that trained 200+ seniors',
    badges: [
      { id: '3', name: 'Digital Bridge', icon: '💻', color: 'bg-green-100 text-green-700', description: 'Trained 100+ people in digital skills' },
      { id: '4', name: 'Mentor', icon: '👨‍🏫', color: 'bg-purple-100 text-purple-700', description: 'Mentored 50+ community members' }
    ]
  }
];
