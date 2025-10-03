
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ImpactAnalyticsService } from "@/services/impactAnalyticsService";

export interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string | null;
  cover_image: string | null;
  tags: string[];
  is_private: boolean;
  admin_id: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  is_member?: boolean;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

// Fetch all groups
export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members(count)
        `);
      
      if (error) throw error;
      
      return data?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      })) || [];
    }
  });
};

// Fetch user's groups
export const useUserGroups = () => {
  return useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          groups(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(item => item.groups).filter(Boolean) || [];
    }
  });
};

// Fetch suggested groups (not joined by user)
export const useSuggestedGroups = () => {
  return useQuery({
    queryKey: ['suggested-groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get user's joined group IDs
      const { data: userGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const joinedGroupIds = userGroups?.map(g => g.group_id) || [];

      // Get groups not joined by user
      let query = supabase
        .from('groups')
        .select(`
          *,
          group_members(count)
        `);

      if (joinedGroupIds.length > 0) {
        query = query.not('id', 'in', `(${joinedGroupIds.join(',')})`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0,
        recentActivity: 'Active this week',
        activity: 'Active' as const
      })) || [];
    }
  });
};

// Join a group
export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (groupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: async (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-groups'] });
      
      // Track impact for group join
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: group } = await supabase
          .from('groups')
          .select('name')
          .eq('id', groupId)
          .single();
        
        await ImpactAnalyticsService.awardImpactPoints(
          user.id,
          'engagement',
          5,
          `Joined community group: ${group?.name || 'Unknown'}`,
          { groupId, engagementType: 'group_join' }
        );
      }
      
      toast({
        title: "Joined group!",
        description: "You've successfully joined the community group. +5 impact points earned!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error joining group",
        description: error.message || "Failed to join group",
        variant: "destructive",
      });
    }
  });
};

// Leave a group
export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (groupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-groups'] });
      toast({
        title: "Left group",
        description: "You've left the community group.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error leaving group",
        description: error.message || "Failed to leave group",
        variant: "destructive",
      });
    }
  });
};
