
import { useQuery } from "@tanstack/react-query";
import { fetchSuggestedConnections } from "@/services/connectionQueries";

export const useSuggestedConnections = () => {
  return useQuery({
    queryKey: ['suggested-connections'],
    queryFn: fetchSuggestedConnections,
  });
};
