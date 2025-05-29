
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { validateFeedPost } from "./validation";
import { FeedPost } from "@/types/feed";
import { mockPosts } from "@/data/mockPosts";
import { QUERY_KEYS } from "./queryKeys";

export const useFeedPosts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FEED_POSTS,
    queryFn: async (): Promise<FeedPost[]> => {
      try {
        // Try to fetch from API first
        const data = await apiClient.get<FeedPost[]>('/posts');
        return data.map(post => validateFeedPost(post));
      } catch (error) {
        console.log('API unavailable, using mock data');
        // Fallback to mock data
        return mockPosts.map(post => validateFeedPost(post));
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for frequently updated content
  });
};

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
