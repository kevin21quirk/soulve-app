
import { CommunityChampion } from "@/types/champions";

export const mockCommunityChampions: CommunityChampion[] = [
  {
    id: "champion_1",
    name: "Sarah Mitchell",
    avatar: "/avatars/sarah.jpg",
    title: "Community Leader & Emergency Response Coordinator",
    location: "London, UK",
    trustScore: 98,
    trustLevel: "impact_champion",
    helpedCount: 347,
    specialties: ["Emergency Response", "Elderly Care", "Community Events"],
    bio: "Dedicated community leader with 5+ years of volunteer experience. Specializes in emergency response and organizing community support networks.",
    badges: [
      {
        id: "emergency_hero",
        name: "Emergency Hero",
        icon: "🚨",
        color: "bg-red-100 text-red-700",
        description: "Responded to 50+ emergency situations"
      },
      {
        id: "community_builder",
        name: "Community Builder",
        icon: "🏘️",
        color: "bg-blue-100 text-blue-700",
        description: "Created 10+ community groups"
      },
      {
        id: "trusted_mentor",
        name: "Trusted Mentor",
        icon: "⭐",
        color: "bg-yellow-100 text-yellow-700",
        description: "Mentored 100+ new helpers"
      }
    ],
    isVerified: true,
    joinedDate: "Jan 2019",
    totalImpactPoints: 2150,
    recentAchievement: "Organized neighborhood storm response team"
  },
  {
    id: "champion_2",
    name: "Marcus Chen",
    avatar: "/avatars/marcus.jpg",
    title: "Tech for Good Advocate",
    location: "Manchester, UK",
    trustScore: 96,
    trustLevel: "community_leader",
    helpedCount: 234,
    specialties: ["Digital Literacy", "Tech Support", "Youth Mentoring"],
    bio: "Software engineer passionate about bridging the digital divide. Runs free coding workshops for underserved communities.",
    badges: [
      {
        id: "digital_champion",
        name: "Digital Champion",
        icon: "💻",
        color: "bg-purple-100 text-purple-700",
        description: "Taught 200+ people digital skills"
      },
      {
        id: "youth_mentor",
        name: "Youth Mentor",
        icon: "🎓",
        color: "bg-green-100 text-green-700",
        description: "Mentored 50+ young people"
      }
    ],
    isVerified: true,
    joinedDate: "Mar 2020",
    totalImpactPoints: 1890,
    recentAchievement: "Launched coding bootcamp for teens"
  },
  {
    id: "champion_3",
    name: "Emma Thompson",
    avatar: "/avatars/emma.jpg",
    title: "Environmental Champion",
    location: "Brighton, UK",
    trustScore: 94,
    trustLevel: "community_leader",
    helpedCount: 189,
    specialties: ["Environmental Action", "Sustainability", "Community Gardens"],
    bio: "Environmental scientist leading local sustainability initiatives. Expert in community-driven environmental projects.",
    badges: [
      {
        id: "eco_warrior",
        name: "Eco Warrior",
        icon: "🌱",
        color: "bg-green-100 text-green-700",
        description: "Led 25+ environmental projects"
      },
      {
        id: "green_innovator",
        name: "Green Innovator",
        icon: "♻️",
        color: "bg-emerald-100 text-emerald-700",
        description: "Innovative sustainability solutions"
      }
    ],
    isVerified: true,
    joinedDate: "Jun 2020",
    totalImpactPoints: 1650,
    recentAchievement: "Started community composting program"
  }
];
