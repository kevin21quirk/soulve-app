
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBlockUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const blockUser = useMutation({
    mutationFn: async ({ blockedId, reason }: { blockedId: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('user_blocks')
        .insert({
          blocked_id: blockedId,
          reason: reason || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-search'] });
      toast({
        title: "User blocked",
        description: "You will no longer see content from this user.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error blocking user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unblockUser = useMutation({
    mutationFn: async (blockedId: string) => {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocked_id', blockedId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      toast({
        title: "User unblocked",
        description: "You can now see content from this user again.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error unblocking user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    blockUser: blockUser.mutate,
    unblockUser: unblockUser.mutate,
    isBlocking: blockUser.isPending,
    isUnblocking: unblockUser.isPending,
  };
};
