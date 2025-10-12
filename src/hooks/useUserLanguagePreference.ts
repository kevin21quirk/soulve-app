import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LanguagePreference {
  preferred_language: string;
  auto_translate: boolean;
  show_translation_button: boolean;
}

export const useUserLanguagePreference = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preference, isLoading } = useQuery({
    queryKey: ['language-preference', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }

      return data || {
        preferred_language: 'en',
        auto_translate: false,
        show_translation_button: true,
      };
    },
    enabled: !!user,
  });

  const updatePreference = useMutation({
    mutationFn: async (updates: Partial<LanguagePreference>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['language-preference'] });
    },
  });

  return {
    preference,
    isLoading,
    updatePreference: updatePreference.mutate,
    isUpdating: updatePreference.isPending,
  };
};