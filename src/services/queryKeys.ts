
// Centralized query key definitions for React Query
export const QUERY_KEYS = {
  FEED_POSTS: ['feedPosts'] as const,
  CONNECTIONS: ['connections'] as const,
  CONVERSATIONS: ['conversations'] as const,
  MESSAGES: (conversationId: string) => ['messages', conversationId] as const,
  ANALYTICS: ['analytics'] as const,
  USER_PROFILE: ['userProfile'] as const,
} as const;
