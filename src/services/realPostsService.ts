
import { useQuery } from '@tanstack/react-query';

// Mock data for now - in a real app this would connect to your backend
const mockPosts = [
  {
    id: '1',
    title: 'Help needed with grocery shopping',
    content: 'Looking for someone to help with weekly grocery runs for my elderly neighbor.',
    category: 'help_needed',
    urgency: 'medium',
    location: 'Downtown District',
    tags: ['transportation', 'elderly care'],
    created_at: new Date().toISOString(),
    author_profile: {
      first_name: 'Sarah',
      last_name: 'Chen',
      avatar_url: 'https://avatar.vercel.sh/sarah.png'
    },
    interactions: {
      like_count: 12,
      comment_count: 3
    },
    comments: []
  },
  {
    id: '2',
    title: 'Volunteer opportunity at food bank',
    content: 'Join our team distributing meals to families in need every Saturday morning.',
    category: 'volunteer',
    urgency: 'high',
    location: 'Community Center',
    tags: ['volunteer', 'food assistance'],
    created_at: new Date().toISOString(),
    author_profile: {
      first_name: 'Maria',
      last_name: 'Rodriguez',
      avatar_url: 'https://avatar.vercel.sh/maria.png'
    },
    interactions: {
      like_count: 24,
      comment_count: 8
    },
    comments: []
  }
];

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockPosts;
    },
  });
};
