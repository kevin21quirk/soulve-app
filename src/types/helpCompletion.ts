
export interface HelpCompletionRequest {
  id: string;
  post_id: string;
  helper_id: string;
  requester_id: string;
  status: 'pending' | 'approved' | 'rejected';
  helper_message?: string;
  feedback_rating?: number;
  feedback_message?: string;
  completion_evidence?: Record<string, any>;
  created_at: string;
  reviewed_at?: string;
  expires_at?: string;
}

export interface CreateHelpCompletionRequest {
  post_id: string;
  helper_message?: string;
  completion_evidence?: Record<string, any>;
}

export interface ReviewHelpCompletionRequest {
  status: 'approved' | 'rejected';
  feedback_rating?: number;
  feedback_message?: string;
}
