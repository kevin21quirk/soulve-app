
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { validateFeedPost, validateConnectionRequest, validateMessage, validateAnalyticsData } from "./validation";
import { FeedPost } from "@/types/feed";
import { ConnectionRequest } from "@/types/connections";
import { Message, Conversation } from "@/types/messaging";
import { mockPosts } from "@/data/mockPosts";
import { mockConnections } from "@/data/mockConnections";
import { mockConversations, mockMessages } from "@/data/mockMessaging";

// Query Keys
export const QUERY_KEYS = {
  FEED_POSTS: ['feedPosts'] as const,
  CONNECTIONS: ['connections'] as const,
  CONVERSATIONS: ['conversations'] as const,
  MESSAGES: (conversationId: string) => ['messages', conversationId] as const,
  ANALYTICS: ['analytics'] as const,
  USER_PROFILE: ['userProfile'] as const,
} as const;

// Data Service Functions
export const useFeedPosts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FEED_POSTS,
    queryFn: async (): Promise<FeedPost[]> => {
      try {
        // Try to fetch from API first
        const data = await apiClient.get<FeedPost[]>('/posts');
        return data.map(validateFeedPost);
      } catch (error) {
        console.log('API unavailable, using mock data');
        // Fallback to mock data
        return mockPosts.map(validateFeedPost);
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for frequently updated content
  });
};

export const useConnections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CONNECTIONS,
    queryFn: async (): Promise<ConnectionRequest[]> => {
      try {
        const data = await apiClient.get<ConnectionRequest[]>('/connections');
        return data.map(validateConnectionRequest);
      } catch (error) {
        console.log('API unavailable, using mock data');
        return mockConnections.map(validateConnectionRequest);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS,
    queryFn: async (): Promise<Conversation[]> => {
      try {
        const data = await apiClient.get<Conversation[]>('/conversations');
        return data;
      } catch (error) {
        console.log('API unavailable, using mock data');
        return mockConversations;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute for messaging
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MESSAGES(conversationId),
    queryFn: async (): Promise<Message[]> => {
      try {
        const data = await apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
        return data.map(validateMessage);
      } catch (error) {
        console.log('API unavailable, using mock data');
        return mockMessages.map(validateMessage);
      }
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds for real-time messaging
  });
};

export const useAnalyticsData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn: async () => {
      try {
        const data = await apiClient.get('/analytics');
        return validateAnalyticsData(data);
      } catch (error) {
        console.log('API unavailable, using mock data');
        // Return mock data in the expected format
        return validateAnalyticsData({
          helpActivityData: [
            { week: "Week 1", helped: 3, received: 1 },
            { week: "Week 2", helped: 7, received: 2 },
            { week: "Week 3", helped: 5, received: 4 },
            { week: "Week 4", helped: 9, received: 3 },
            { week: "Week 5", helped: 12, received: 5 },
            { week: "Week 6", helped: 8, received: 2 }
          ],
          engagementData: [
            { day: "Mon", posts: 2, likes: 15, comments: 8 },
            { day: "Tue", posts: 1, likes: 22, comments: 12 },
            { day: "Wed", posts: 3, likes: 18, comments: 6 },
            { day: "Thu", posts: 2, likes: 25, comments: 15 },
            { day: "Fri", posts: 4, likes: 30, comments: 18 },
            { day: "Sat", posts: 1, likes: 12, comments: 5 },
            { day: "Sun", posts: 2, likes: 20, comments: 10 }
          ],
          categoryData: [
            { name: "Moving Help", value: 35, color: "#8884d8" },
            { name: "Tutoring", value: 25, color: "#82ca9d" },
            { name: "Pet Care", value: 20, color: "#ffc658" },
            { name: "Tech Support", value: 12, color: "#ff7c7c" },
            { name: "Other", value: 8, color: "#8dd1e1" }
          ],
          impactMetrics: [
            { title: "People Helped", value: "47", change: "+15%", trend: "up" as const },
            { title: "Community Impact", value: "312hrs", change: "+22%", trend: "up" as const },
            { title: "Trust Score", value: "94%", change: "+2%", trend: "up" as const },
            { title: "Response Time", value: "2.3h", change: "-18%", trend: "down" as const }
          ]
        });
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for analytics
  });
};

// Mutation Hooks
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: Omit<FeedPost, 'id' | 'timestamp'>) => {
      const postData = {
        ...newPost,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      
      try {
        return await apiClient.post<FeedPost>('/posts', postData);
      } catch (error) {
        console.log('API unavailable, returning mock response');
        return validateFeedPost(postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEED_POSTS });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const messageData = {
        id: Date.now().toString(),
        sender: "You",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: "sent" as const,
      };
      
      try {
        return await apiClient.post<Message>(`/conversations/${conversationId}/messages`, messageData);
      } catch (error) {
        console.log('API unavailable, returning mock response');
        return validateMessage(messageData);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });
    },
  });
};

export const useUpdateConnection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ConnectionRequest['status'] }) => {
      try {
        return await apiClient.put<ConnectionRequest>(`/connections/${id}`, { status });
      } catch (error) {
        console.log('API unavailable, returning mock response');
        return { id, status };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONNECTIONS });
    },
  });
};
