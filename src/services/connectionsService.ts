
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { validateConnectionRequest } from "./validation";
import { ConnectionRequest } from "@/types/connections";
import { mockConnections } from "@/data/mockConnections";
import { QUERY_KEYS } from "./queryKeys";

export const useConnections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CONNECTIONS,
    queryFn: async (): Promise<ConnectionRequest[]> => {
      try {
        const data = await apiClient.get<ConnectionRequest[]>('/connections');
        return data.map(connection => validateConnectionRequest(connection));
      } catch (error) {
        console.log('API unavailable, using mock data');
        return mockConnections.map(connection => validateConnectionRequest(connection));
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
