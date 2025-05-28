
export type VerificationType = 
  | 'email'
  | 'phone'
  | 'government_id'
  | 'organization'
  | 'community_leader'
  | 'expert'
  | 'background_check';

export type VerificationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired';

export interface UserVerification {
  id: string;
  user_id: string;
  verification_type: VerificationType;
  status: VerificationStatus;
  verified_at?: string;
  expires_at?: string;
  verification_data?: any;
  verified_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TrustScoreHistoryEntry {
  id: string;
  user_id: string;
  previous_score?: number;
  new_score: number;
  change_reason: string;
  verification_id?: string;
  created_at: string;
}
