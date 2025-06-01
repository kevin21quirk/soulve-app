
import { useQuery } from "@tanstack/react-query";
import { fetchUserConnections } from "@/services/connectionQueries";

export const useRealConnections = () => {
  return useQuery({
    queryKey: ['real-connections'],
    queryFn: fetchUserConnections,
  });
};
