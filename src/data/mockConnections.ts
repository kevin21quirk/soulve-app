
import { ConnectionRequest } from "@/types/connections";

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
