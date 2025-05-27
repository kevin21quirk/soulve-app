
import { Recommendation } from "@/types/recommendations";

export const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "connection",
    title: "Connect with Maria Santos",
    description: "Licensed nurse in your area with 96% trust score",
    confidence: 92,
    reasoning: "Based on your interest in healthcare and community service",
    actionLabel: "Send Request",
    data: {
      user: "Maria Santos",
      avatar: "",
      location: "0.8 miles away",
      mutualConnections: 3,
      skills: ["Healthcare", "Senior Care"]
    }
  },
  {
    id: "2",
    type: "help_opportunity",
    title: "Dog Walking Opportunity",
    description: "Alex Rodriguez needs help with daily dog walks",
    confidence: 88,
    reasoning: "Matches your pet care skills and availability",
    actionLabel: "Offer Help",
    data: {
      location: "Maple Street",
      timeCommitment: "30 min daily",
      compensation: "$20 per walk",
      urgency: "high"
    }
  },
  {
    id: "3",
    type: "skill_match",
    title: "Tutoring Opportunity",
    description: "High school student needs math tutoring",
    confidence: 85,
    reasoning: "Your teaching background and high ratings in education",
    actionLabel: "Learn More",
    data: {
      subject: "Algebra & Geometry",
      schedule: "Weekends",
      level: "High School",
      remote: true
    }
  },
  {
    id: "4",
    type: "post",
    title: "Community Garden Project",
    description: "New volunteer opportunity at Riverside Park",
    confidence: 78,
    reasoning: "Your environmental interests and past gardening activities",
    actionLabel: "Join Project",
    data: {
      organizer: "Green Community Initiative",
      date: "This Saturday",
      volunteers: 12,
      impact: "200 new plants"
    }
  }
];
