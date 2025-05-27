
import { ConnectionRequest, Group, Campaign, PeopleYouMayKnow } from "@/types/connections";

export const mockConnections: ConnectionRequest[] = [
  {
    id: "1",
    name: "Emily Rodriguez",
    avatar: "",
    trustScore: 94,
    mutualConnections: 8,
    helpedPeople: 23,
    location: "Downtown",
    bio: "Community volunteer passionate about helping families in need. Specializes in childcare and meal preparation.",
    status: "pending",
    skills: ["Childcare", "Cooking", "Event Planning"],
    joinedDate: "6 months ago",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "",
    trustScore: 87,
    mutualConnections: 5,
    helpedPeople: 15,
    location: "Riverside",
    bio: "Handyman and carpenter offering home repair services. Available weekends for community projects.",
    status: "sent",
    skills: ["Home Repair", "Carpentry", "Electrical"],
    joinedDate: "1 year ago",
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Maria Santos",
    avatar: "",
    trustScore: 96,
    mutualConnections: 12,
    helpedPeople: 31,
    location: "Uptown",
    bio: "Licensed nurse providing health advice and emotional support. Active in senior care initiatives.",
    status: "connected",
    skills: ["Healthcare", "Senior Care", "Counseling"],
    joinedDate: "2 years ago",
    lastActive: "Online now"
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "",
    trustScore: 89,
    mutualConnections: 3,
    helpedPeople: 12,
    location: "Westside",
    bio: "Software developer offering tech support and digital literacy training for seniors.",
    status: "pending",
    skills: ["Tech Support", "Teaching", "Web Development"],
    joinedDate: "8 months ago",
    lastActive: "30 minutes ago"
  }
];

export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Downtown Neighborhood Watch",
    description: "Keeping our community safe through collaboration and mutual support. Join us for monthly meetings and safety initiatives.",
    coverImage: "",
    memberCount: 247,
    category: "Safety",
    isPrivate: false,
    isJoined: true,
    location: "Downtown",
    tags: ["Safety", "Neighborhood", "Community"],
    lastActivity: "2 hours ago",
    adminName: "Sarah Johnson",
    adminAvatar: ""
  },
  {
    id: "g2",
    name: "Local Food Bank Volunteers",
    description: "Dedicated volunteers helping distribute food to families in need every Saturday morning.",
    coverImage: "",
    memberCount: 189,
    category: "Volunteering",
    isPrivate: false,
    isJoined: false,
    location: "City Center",
    tags: ["Volunteering", "Food", "Charity"],
    lastActivity: "1 day ago",
    adminName: "Mike Rodriguez",
    adminAvatar: ""
  },
  {
    id: "g3",
    name: "Senior Care Support Network",
    description: "Private group for families and caregivers supporting elderly community members.",
    coverImage: "",
    memberCount: 156,
    category: "Healthcare",
    isPrivate: true,
    isJoined: true,
    location: "Riverside",
    tags: ["Senior Care", "Healthcare", "Support"],
    lastActivity: "4 hours ago",
    adminName: "Dr. Lisa Chen",
    adminAvatar: ""
  },
  {
    id: "g4",
    name: "Community Garden Coalition",
    description: "Growing together! Share tips, organize events, and build a greener neighborhood.",
    coverImage: "",
    memberCount: 98,
    category: "Environment",
    isPrivate: false,
    isJoined: false,
    location: "Westside",
    tags: ["Gardening", "Environment", "Education"],
    lastActivity: "6 hours ago",
    adminName: "Tom Wilson",
    adminAvatar: ""
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    title: "Winter Clothing Drive",
    description: "Collecting warm clothes and blankets for homeless families during the cold season.",
    organizer: "Community Outreach Center",
    organizerAvatar: "",
    coverImage: "",
    participantCount: 342,
    goalAmount: 5000,
    currentAmount: 3200,
    endDate: "Dec 15",
    location: "City-wide",
    category: "fundraising",
    tags: ["Winter", "Clothing", "Homeless"],
    isParticipating: true,
    urgency: "high"
  },
  {
    id: "c2",
    title: "Community Garden Expansion",
    description: "Help us expand the community garden to provide fresh produce to more families.",
    organizer: "Green Spaces Initiative",
    organizerAvatar: "",
    coverImage: "",
    participantCount: 156,
    endDate: "Jan 30",
    location: "Westside Park",
    category: "volunteer",
    tags: ["Gardening", "Environment", "Food"],
    isParticipating: false,
    urgency: "medium"
  },
  {
    id: "c3",
    title: "Digital Literacy for Seniors",
    description: "Teaching elderly community members how to use smartphones and computers safely.",
    organizer: "Tech for Good",
    organizerAvatar: "",
    coverImage: "",
    participantCount: 89,
    endDate: "Ongoing",
    location: "Community Center",
    category: "awareness",
    tags: ["Technology", "Education", "Seniors"],
    isParticipating: true,
    urgency: "low"
  }
];

export const mockPeopleYouMayKnow: PeopleYouMayKnow[] = [
  {
    id: "p1",
    name: "Jennifer Martinez",
    avatar: "",
    mutualConnections: 5,
    reason: "Lives in your area",
    location: "Downtown",
    workPlace: "City Hospital",
    school: "State University"
  },
  {
    id: "p2",
    name: "Robert Chen",
    avatar: "",
    mutualConnections: 3,
    reason: "Works at City Hospital",
    location: "Uptown",
    workPlace: "City Hospital"
  },
  {
    id: "p3",
    name: "Amy Thompson",
    avatar: "",
    mutualConnections: 7,
    reason: "Attended State University",
    location: "Riverside",
    school: "State University"
  },
  {
    id: "p4",
    name: "Carlos Gomez",
    avatar: "",
    mutualConnections: 2,
    reason: "Member of Downtown Neighborhood Watch",
    location: "Downtown",
    workPlace: "Local Fire Department"
  }
];
