
import { RecommendationService } from './recommendationService';
import type { ApiClient } from '@/lib/apiClient';

export interface QuestionnaireResponse {
  user_type: string;
  response_data: any;
  motivation?: string;
  agree_to_terms: boolean;
}

export const saveQuestionnaireResponse = async (api: ApiClient, data: QuestionnaireResponse) => {
  // Save via the Neon-backed API (Clerk auth)
  await api.post('/profiles/me/questionnaire', {
    user_type: data.user_type,
    response_data: data.response_data,
    motivation: data.motivation,
    agree_to_terms: data.agree_to_terms,
  });

  // Best-effort preference sync — still Supabase-bound until that migrates
  try {
    const profile = await api.get<{ id: string }>('/profiles/me');
    await RecommendationService.syncUserPreferences(profile.id);
    console.log('[questionnaireService] Synced user preferences after questionnaire save');
  } catch (syncError) {
    console.warn('[questionnaireService] Error syncing preferences (non-critical):', syncError);
  }
};

