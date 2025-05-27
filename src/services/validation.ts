
import { z } from 'zod';

// Validation Schemas
export const feedPostSchema = z.object({
  id: z.string(),
  author: z.string().min(1, 'Author is required'),
  avatar: z.string(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  category: z.enum(['help-needed', 'help-offered', 'success-story']),
  timestamp: z.string(),
  location: z.string().min(1, 'Location is required'),
  responses: z.number().min(0),
  likes: z.number().min(0),
  isLiked: z.boolean(),
});

export const connectionRequestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  avatar: z.string(),
  trustScore: z.number().min(0).max(100),
  mutualConnections: z.number().min(0),
  helpedPeople: z.number().min(0),
  location: z.string().min(1, 'Location is required'),
  bio: z.string().max(300, 'Bio too long'),
  status: z.enum(['pending', 'sent', 'connected', 'declined']),
  skills: z.array(z.string()),
  joinedDate: z.string(),
  lastActive: z.string(),
});

export const messageSchema = z.object({
  id: z.string(),
  sender: z.string().min(1, 'Sender is required'),
  content: z.string().min(1, 'Content is required').max(1000, 'Message too long'),
  timestamp: z.string(),
  isOwn: z.boolean(),
  status: z.enum(['sent', 'delivered', 'read']).optional(),
});

export const analyticsDataSchema = z.object({
  helpActivityData: z.array(z.object({
    week: z.string(),
    helped: z.number().min(0),
    received: z.number().min(0),
  })),
  engagementData: z.array(z.object({
    day: z.string(),
    posts: z.number().min(0),
    likes: z.number().min(0),
    comments: z.number().min(0),
  })),
  categoryData: z.array(z.object({
    name: z.string(),
    value: z.number().min(0),
    color: z.string(),
  })),
  impactMetrics: z.array(z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.enum(['up', 'down']),
  })),
});

// Validation Functions
export const validateFeedPost = (data: unknown) => {
  try {
    return feedPostSchema.parse(data);
  } catch (error) {
    console.error('Feed post validation failed:', error);
    throw new Error('Invalid feed post data');
  }
};

export const validateConnectionRequest = (data: unknown) => {
  try {
    return connectionRequestSchema.parse(data);
  } catch (error) {
    console.error('Connection request validation failed:', error);
    throw new Error('Invalid connection request data');
  }
};

export const validateMessage = (data: unknown) => {
  try {
    return messageSchema.parse(data);
  } catch (error) {
    console.error('Message validation failed:', error);
    throw new Error('Invalid message data');
  }
};

export const validateAnalyticsData = (data: unknown) => {
  try {
    return analyticsDataSchema.parse(data);
  } catch (error) {
    console.error('Analytics data validation failed:', error);
    throw new Error('Invalid analytics data');
  }
};

// Data Sanitization
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
