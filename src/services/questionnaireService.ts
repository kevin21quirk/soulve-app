
import { supabase } from '@/integrations/supabase/client';
import { RecommendationService } from './recommendationService';

export interface QuestionnaireResponse {
  user_type: string;
  response_data: any;
  motivation?: string;
  agree_to_terms: boolean;
}

export const saveQuestionnaireResponse = async (data: QuestionnaireResponse) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  // Save questionnaire response - trigger will sync to profile automatically
  const { error } = await supabase
    .from('questionnaire_responses')
    .insert({
      user_id: user.user.id,
      user_type: data.user_type,
      response_data: data.response_data,
      motivation: data.motivation,
      agree_to_terms: data.agree_to_terms
    });

  if (error) {
    console.error('Error saving questionnaire response:', error);
    throw error;
  }

  // Also manually sync preferences to ensure they're ready immediately
  // The trigger handles this too, but this ensures immediate availability
  try {
    await RecommendationService.syncUserPreferences(user.user.id);
    console.log('[questionnaireService] Synced user preferences after questionnaire save');
  } catch (syncError) {
    console.warn('[questionnaireService] Error syncing preferences (non-critical):', syncError);
  }
};

export const getQuestionnaireResponse = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching questionnaire response:', error);
    throw error;
  }

  return data;
};
