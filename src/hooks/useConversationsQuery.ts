import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getConversations } from "@/services/messagingService";

export const useConversationsQuery = () => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const user = await getUser();
      if (!user) throw new Error('Not authenticated');
      return getConversations(user.id);
    },
    refetchOnMount: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
