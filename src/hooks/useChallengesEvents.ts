
import { useState, useEffect } from 'react';
import { Challenge, CommunityEvent, UserProgress } from '@/types/challenges';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: "challenge_1",
    title: "Plant 1000 Trees",
    description: "Join our community effort to plant 1000 trees this month and help combat climate change.",
    type: "community",
    category: "environment",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-01-31T23:59:59Z",
    targetValue: 1000,
    currentProgress: 687,
    unit: "trees",
    participants: 156,
    maxParticipants: 200,
    difficulty: "medium",
    points: 100,
    creatorId: "user_1",
    creatorName: "Green Earth Initiative",
    status: "active",
    image: "/placeholder-tree.jpg",
    tags: ["environment", "climate", "trees"],
    isTeamBased: false,
    rewards: [
      { type: "points", value: 100, description: "100 trust points" },
      { type: "badge", value: "Tree Planter", description: "Tree Planter badge" }
    ],
    minTrustScore: 50
  },
  {
    id: "challenge_2",
    title: "Community Cleanup Squad",
    description: "Form teams of 4 and clean up different neighborhoods. Most litter collected wins!",
    type: "team",
    category: "community",
    startDate: "2024-01-15T08:00:00Z",
    endDate: "2024-01-21T18:00:00Z",
    targetValue: 500,
    currentProgress: 230,
    unit: "kg of litter",
    participants: 48,
    maxParticipants: 60,
    difficulty: "easy",
    points: 75,
    creatorId: "user_2",
    creatorName: "Clean Streets Alliance",
    status: "active",
    tags: ["cleanup", "community", "environment"],
    isTeamBased: true,
    teams: [
      {
        id: "team_1",
        name: "Eco Warriors",
        members: [
          { userId: "user_3", userName: "Alice Johnson", avatar: "", joinedAt: "2024-01-15T09:00:00Z", contribution: 45 },
          { userId: "user_4", userName: "Bob Smith", avatar: "", joinedAt: "2024-01-15T09:15:00Z", contribution: 38 }
        ],
        captain: "user_3",
        progress: 83,
        createdAt: "2024-01-15T09:00:00Z"
      }
    ],
    rewards: [
      { type: "points", value: 75, description: "75 trust points per person" },
      { type: "voucher", value: "50", description: "£50 local business voucher for winning team" }
    ]
  },
  {
    id: "challenge_3",
    title: "Read to Children",
    description: "Volunteer to read stories to children at local libraries and schools.",
    type: "individual",
    category: "education",
    startDate: "2024-01-10T00:00:00Z",
    endDate: "2024-02-10T23:59:59Z",
    targetValue: 100,
    currentProgress: 23,
    unit: "hours",
    participants: 34,
    difficulty: "easy",
    points: 50,
    creatorId: "user_5",
    creatorName: "Reading Rainbow Foundation",
    status: "active",
    tags: ["education", "children", "reading"],
    isTeamBased: false,
    rewards: [
      { type: "points", value: 50, description: "50 trust points" },
      { type: "certificate", value: "Literacy Champion", description: "Official volunteer certificate" }
    ],
    minTrustScore: 70
  }
];

// Mock data for events
const mockEvents: CommunityEvent[] = [
  {
    id: "event_1",
    title: "Annual Charity Gala",
    description: "Join us for an evening of celebration, networking, and fundraising for local charities.",
    type: "fundraiser",
    category: "fundraising",
    startDate: "2024-02-14T19:00:00Z",
    endDate: "2024-02-14T23:00:00Z",
    location: {
      type: "physical",
      address: "Grand Hotel Ballroom",
      city: "London",
      country: "UK",
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    capacity: 200,
    attendees: 156,
    organizerId: "org_1",
    organizerName: "London Charity Alliance",
    status: "published",
    image: "/placeholder-gala.jpg",
    tags: ["gala", "fundraising", "networking"],
    cost: 75,
    currency: "£",
    minTrustScore: 60,
    agenda: [
      { id: "1", time: "19:00", title: "Welcome Reception", description: "Networking and drinks", speaker: "" },
      { id: "2", time: "20:00", title: "Dinner", description: "Three-course meal", speaker: "" },
      { id: "3", time: "21:30", title: "Charity Presentations", description: "Hear from our beneficiaries", speaker: "Various" },
      { id: "4", time: "22:30", title: "Live Auction", description: "Bid on exclusive items", speaker: "Professional Auctioneer" }
    ]
  },
  {
    id: "event_2",
    title: "Sustainable Living Workshop",
    description: "Learn practical tips for reducing your environmental impact at home.",
    type: "workshop",
    category: "education",
    startDate: "2024-01-28T14:00:00Z",
    endDate: "2024-01-28T17:00:00Z",
    location: {
      type: "hybrid",
      address: "Community Center",
      city: "Manchester",
      country: "UK",
      virtualLink: "https://zoom.us/j/123456789"
    },
    capacity: 50,
    attendees: 32,
    organizerId: "org_2",
    organizerName: "Eco Education Hub",
    status: "published",
    tags: ["workshop", "sustainability", "education"],
    cost: 15,
    currency: "£",
    materials: ["Notebook", "Eco-friendly starter kit", "Resource booklet"]
  },
  {
    id: "event_3",
    title: "Virtual Fundraising Concert",
    description: "Enjoy live music from local artists while supporting homeless shelters.",
    type: "fundraiser",
    category: "awareness",
    startDate: "2024-02-05T20:00:00Z",
    endDate: "2024-02-05T22:00:00Z",
    location: {
      type: "virtual",
      virtualLink: "https://stream.charity-concert.org"
    },
    capacity: 1000,
    attendees: 234,
    organizerId: "org_3",
    organizerName: "Music for Change",
    status: "published",
    tags: ["concert", "music", "virtual", "homeless"]
  }
];

interface UserChallengeProgress {
  challengeId: string;
  progress: number;
  joinedAt: string;
}

interface UserEventRegistration {
  eventId: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'cancelled';
}

export const useChallengesEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallengeProgress[]>([]);
  const [userEvents, setUserEvents] = useState<UserEventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setChallenges(mockChallenges);
        setEvents(mockEvents);
        
        // Mock user participation data
        setUserChallenges([
          { challengeId: "challenge_1", progress: 5, joinedAt: "2024-01-02T10:00:00Z" }
        ]);
        
        setUserEvents([
          { eventId: "event_2", registeredAt: "2024-01-20T15:30:00Z", status: "registered" }
        ]);
        
      } catch (error) {
        console.error('Failed to load challenges and events:', error);
        toast({
          title: "Error",
          description: "Failed to load challenges and events",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const joinChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join challenges",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newParticipation: UserChallengeProgress = {
        challengeId,
        progress: 0,
        joinedAt: new Date().toISOString()
      };
      
      setUserChallenges(prev => [...prev, newParticipation]);
      
      // Update challenge participant count
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, participants: challenge.participants + 1 }
          : challenge
      ));
      
      toast({
        title: "Success!",
        description: "You've joined the challenge. Start making an impact!"
      });
      
    } catch (error) {
      console.error('Failed to join challenge:', error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      });
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRegistration: UserEventRegistration = {
        eventId,
        registeredAt: new Date().toISOString(),
        status: "registered"
      };
      
      setUserEvents(prev => [...prev, newRegistration]);
      
      // Update event attendee count
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      ));
      
      toast({
        title: "Registration Successful!",
        description: "You're registered for the event. We'll send you details soon."
      });
      
    } catch (error) {
      console.error('Failed to register for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    challenges,
    events,
    userChallenges,
    userEvents,
    loading,
    joinChallenge,
    registerForEvent
  };
};
