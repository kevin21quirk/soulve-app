
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { validateMessage } from "./validation";
import { Message, Conversation } from "@/types/messaging";
import { mockConversations, mockMessages } from "@/data/mockMessaging";
import { QUERY_KEYS } from "./queryKeys";

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
        return data.map(message => validateMessage(message));
      } catch (error) {
        console.log('API unavailable, using mock data');
        return mockMessages.map(message => validateMessage(message));
      }
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds for real-time messaging
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
