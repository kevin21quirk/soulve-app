
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  allow_direct_messages: 'everyone' | 'friends' | 'verified' | 'none';
  show_online_status: boolean;
  show_location: boolean;
  show_email: boolean;
  show_phone: boolean;
  allow_tagging: boolean;
  show_activity_feed: boolean;
}

export const usePrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: privacySettings, isLoading } = useQuery({
    queryKey: ['privacy-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Create default settings if none exist
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          profile_visibility: 'public' as const,
          allow_direct_messages: 'everyone' as const,
          show_online_status: true,
          show_location: true,
          show_email: false,
          show_phone: false,
          allow_tagging: true,
          show_activity_feed: true,
        };

        const { data: newData, error: insertError } = await supabase
          .from('user_privacy_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      return data;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (settings: Partial<PrivacySettings>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_privacy_settings')
        .update(settings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-settings', user?.id] });
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    privacySettings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};
