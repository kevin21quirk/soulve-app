import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useESGGoals = (organizationId: string) => {
  return useQuery({
    queryKey: ['esg-goals', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_goals')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(goal => ({
        ...goal,
        progress: goal.current_value && goal.target_value 
          ? Math.round((goal.current_value / goal.target_value) * 100)
          : 0,
      }));
    },
  });
};
