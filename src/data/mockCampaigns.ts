
import { CampaignData } from "@/types/campaigns";

export const mockCampaigns: CampaignData[] = [
  {
    id: '1',
    title: 'Winter Warmth Initiative',
    description: 'Providing warm clothing and heating assistance to vulnerable community members during winter.',
    category: 'emergency-relief',
    urgency: 'urgent',
    location: 'London',
    timeframe: '3 months',
    goal: 'Help 500 families stay warm',
    progress: 65,
    participantCount: 234,
    timeLeft: '45 days left',
    impact: 'Keeping 500+ families warm this winter',
    organizer: 'London Community Action',
    tags: ['winter-aid', 'emergency', 'vulnerable-support'],
    isParticipating: true
  },
  {
    id: '2',
    title: 'Digital Literacy for Seniors',
    description: 'Teaching digital skills to elderly community members to help them stay connected.',
    category: 'education',
    urgency: 'medium',
    location: 'Manchester',
    timeframe: '6 months',
    goal: 'Train 200 seniors',
    progress: 40,
    participantCount: 89,
    timeLeft: '4 months left',
    impact: 'Connecting seniors to the digital world',
    organizer: 'Tech for All',
    tags: ['digital-skills', 'seniors', 'education'],
    isParticipating: false
  },
  {
    id: '3',
    title: 'Community Food Gardens',
    description: 'Creating sustainable food sources in urban areas through community gardens.',
    category: 'environment',
    urgency: 'high',
    location: 'Birmingham',
    timeframe: '12 months',
    goal: 'Establish 10 gardens',
    progress: 75,
    participantCount: 156,
    timeLeft: '3 months left',
    impact: 'Fresh food access for 1000+ families',
    organizer: 'Green Birmingham',
    tags: ['food-security', 'gardening', 'sustainability'],
    isParticipating: true
  }
];
