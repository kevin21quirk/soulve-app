export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export type ContentType = 'video' | 'reading' | 'quiz' | 'interactive';

export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export type DocumentType = 'government_id' | 'selfie' | 'address_proof' | 'qualification_cert' | 'dbs_certificate';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ReferenceStatus = 'pending' | 'completed' | 'expired';

export interface ReferenceContact {
  name: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface Qualification {
  type: string;
  title: string;
  institution: string;
  year: number;
  document_url?: string;
}

export interface HelperApplication {
  id: string;
  user_id: string;
  application_status: ApplicationStatus;
  personal_statement?: string;
  experience_description?: string;
  qualifications: Qualification[];
  reference_contacts: ReferenceContact[];
  availability_commitment?: string;
  preferred_specializations: string[];
  reviewed_by?: string;
  reviewer_notes?: string;
  rejection_reason?: string;
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content_type: ContentType;
  content_url?: string;
  content_html?: string;
  quiz_questions: QuizQuestion[];
  duration_minutes: number;
  passing_score: number;
  order_sequence: number;
  is_required: boolean;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface TrainingProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: TrainingStatus;
  score?: number;
  attempts: number;
  time_spent_minutes: number;
  answers: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationDocument {
  id: string;
  user_id: string;
  application_id?: string;
  document_type: DocumentType;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ReferenceCheck {
  id: string;
  application_id: string;
  reference_name: string;
  reference_email: string;
  reference_phone?: string;
  relationship: string;
  verification_token: string;
  questionnaire_responses: Record<string, any>;
  status: ReferenceStatus;
  submitted_at?: string;
  expires_at: string;
  created_at: string;
}

export interface ApplicationProgress {
  applicationSubmitted: boolean;
  identityVerified: boolean;
  backgroundCheckComplete: boolean;
  trainingComplete: boolean;
  referencesVerified: boolean;
  adminReviewed: boolean;
  overallProgress: number;
}
