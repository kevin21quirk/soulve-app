
import { supabase } from '@/integrations/supabase/client';
import { HelpCompletionRequest, CreateHelpCompletionRequest, ReviewHelpCompletionRequest } from '@/types/helpCompletion';

export class HelpCompletionService {
  static async createCompletionRequest(
    postId: string,
    helperId: string,
    requesterId: string,
    data: CreateHelpCompletionRequest
  ): Promise<HelpCompletionRequest> {
    const { data: result, error } = await supabase
      .from('help_completion_requests')
      .insert({
        post_id: postId,
        helper_id: helperId,
        requester_id: requesterId,
        helper_message: data.helper_message,
        completion_evidence: data.completion_evidence || {}
      })
      .select()
      .single();

    if (error) throw error;
    return result as HelpCompletionRequest;
  }

  static async getCompletionRequestsForHelper(helperId: string): Promise<HelpCompletionRequest[]> {
    const { data, error } = await supabase
      .from('help_completion_requests')
      .select('*')
      .eq('helper_id', helperId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as HelpCompletionRequest[];
  }

  static async getCompletionRequestsForRequester(requesterId: string): Promise<HelpCompletionRequest[]> {
    const { data, error } = await supabase
      .from('help_completion_requests')
      .select('*')
      .eq('requester_id', requesterId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as HelpCompletionRequest[];
  }

  static async reviewCompletionRequest(
    requestId: string,
    review: ReviewHelpCompletionRequest
  ): Promise<HelpCompletionRequest> {
    const { data, error } = await supabase
      .from('help_completion_requests')
      .update({
        status: review.status,
        feedback_rating: review.feedback_rating,
        feedback_message: review.feedback_message,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data as HelpCompletionRequest;
  }

  static async getCompletionRequestForPost(postId: string): Promise<HelpCompletionRequest | null> {
    const { data, error } = await supabase
      .from('help_completion_requests')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as HelpCompletionRequest | null;
  }

  static async quickApproveHelpCompletion(
    requestId: string,
    requesterId: string
  ): Promise<HelpCompletionRequest> {
    const { data, error } = await supabase
      .from('help_completion_requests')
      .update({
        status: 'approved',
        feedback_rating: 5,
        feedback_message: 'Quick approved with 5 stars',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .eq('requester_id', requesterId)
      .select()
      .single();

    if (error) throw error;
    return data as HelpCompletionRequest;
  }
}
