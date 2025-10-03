-- Add new verification types for Safe Space helpers
-- Note: These use the existing user_verifications table

-- Create safe_space_helper_applications table
CREATE TABLE public.safe_space_helper_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_status TEXT NOT NULL DEFAULT 'draft' CHECK (application_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  personal_statement TEXT,
  experience_description TEXT,
  qualifications JSONB DEFAULT '[]'::jsonb,
  reference_contacts JSONB DEFAULT '[]'::jsonb,
  availability_commitment TEXT,
  preferred_specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create safe_space_training_modules table
CREATE TABLE public.safe_space_training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'reading', 'quiz', 'interactive')),
  content_url TEXT,
  content_html TEXT,
  quiz_questions JSONB DEFAULT '[]'::jsonb,
  duration_minutes INTEGER NOT NULL,
  passing_score INTEGER DEFAULT 80,
  order_sequence INTEGER NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create safe_space_helper_training_progress table
CREATE TABLE public.safe_space_helper_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.safe_space_training_modules(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  attempts INTEGER NOT NULL DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create safe_space_verification_documents table
CREATE TABLE public.safe_space_verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('government_id', 'selfie', 'address_proof', 'qualification_cert', 'dbs_certificate')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create safe_space_reference_checks table
CREATE TABLE public.safe_space_reference_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.safe_space_helper_applications(id) ON DELETE CASCADE NOT NULL,
  reference_name TEXT NOT NULL,
  reference_email TEXT NOT NULL,
  reference_phone TEXT,
  relationship TEXT NOT NULL,
  verification_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  questionnaire_responses JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.safe_space_helper_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_space_training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_space_helper_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_space_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_space_reference_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for safe_space_helper_applications
CREATE POLICY "Users can view their own applications"
  ON public.safe_space_helper_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
  ON public.safe_space_helper_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own draft applications"
  ON public.safe_space_helper_applications FOR UPDATE
  USING (auth.uid() = user_id AND application_status IN ('draft', 'submitted'));

CREATE POLICY "Admins can view all applications"
  ON public.safe_space_helper_applications FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all applications"
  ON public.safe_space_helper_applications FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for safe_space_training_modules
CREATE POLICY "Anyone can view active training modules"
  ON public.safe_space_training_modules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage training modules"
  ON public.safe_space_training_modules FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for safe_space_helper_training_progress
CREATE POLICY "Users can view their own training progress"
  ON public.safe_space_helper_training_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training progress"
  ON public.safe_space_helper_training_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training progress"
  ON public.safe_space_helper_training_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all training progress"
  ON public.safe_space_helper_training_progress FOR SELECT
  USING (public.is_admin(auth.uid()));

-- RLS Policies for safe_space_verification_documents
CREATE POLICY "Users can view their own documents"
  ON public.safe_space_verification_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents"
  ON public.safe_space_verification_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unverified documents"
  ON public.safe_space_verification_documents FOR DELETE
  USING (auth.uid() = user_id AND verification_status = 'pending');

CREATE POLICY "Admins can view all verification documents"
  ON public.safe_space_verification_documents FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update document verification status"
  ON public.safe_space_verification_documents FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for safe_space_reference_checks
CREATE POLICY "Users can view their own reference checks"
  ON public.safe_space_reference_checks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.safe_space_helper_applications
    WHERE id = application_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create reference checks for their application"
  ON public.safe_space_reference_checks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.safe_space_helper_applications
    WHERE id = application_id AND user_id = auth.uid()
  ));

CREATE POLICY "Public can view reference check by token"
  ON public.safe_space_reference_checks FOR SELECT
  USING (true);

CREATE POLICY "Public can update reference check by token"
  ON public.safe_space_reference_checks FOR UPDATE
  USING (status = 'pending' AND expires_at > now());

CREATE POLICY "Admins can view all reference checks"
  ON public.safe_space_reference_checks FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'helper-verification-docs',
  'helper-verification-docs',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/heic', 'application/pdf']
);

-- Storage RLS policies
CREATE POLICY "Users can upload their own verification documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'helper-verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'helper-verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own verification documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'helper-verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'helper-verification-docs' AND
    public.is_admin(auth.uid())
  );

-- Seed training modules
INSERT INTO public.safe_space_training_modules (title, description, content_type, duration_minutes, order_sequence, category, content_html, is_required) VALUES
(
  'Understanding Safe Space & Crisis Support',
  'Learn the fundamentals of Safe Space, crisis intervention principles, and the role of a helper in supporting individuals during difficult moments.',
  'reading',
  30,
  1,
  'foundations',
  '<h2>Welcome to Safe Space</h2><p>Safe Space is a confidential, judgment-free environment where individuals can seek emotional support during challenging times...</p>',
  true
),
(
  'Active Listening Skills',
  'Master the art of active listening, including verbal and non-verbal techniques to make people feel heard and understood.',
  'video',
  45,
  2,
  'communication',
  NULL,
  true
),
(
  'Recognizing Mental Health Crisis',
  'Learn to identify signs of mental health crises, including suicidal ideation, severe anxiety, and panic attacks.',
  'video',
  60,
  3,
  'crisis_management',
  NULL,
  true
),
(
  'Boundaries & Self-Care for Helpers',
  'Understand the importance of maintaining healthy boundaries and practicing self-care to prevent burnout.',
  'reading',
  30,
  4,
  'self_care',
  '<h2>Setting Healthy Boundaries</h2><p>As a Safe Space helper, it is crucial to maintain professional boundaries...</p>',
  true
),
(
  'Data Protection & Confidentiality',
  'Understand your legal and ethical obligations regarding user privacy, data protection, and confidentiality.',
  'reading',
  20,
  5,
  'compliance',
  '<h2>Privacy & Confidentiality</h2><p>All conversations in Safe Space are strictly confidential...</p>',
  true
),
(
  'De-escalation Techniques',
  'Learn practical techniques for de-escalating tense situations and helping individuals regain emotional control.',
  'video',
  45,
  6,
  'techniques',
  NULL,
  true
),
(
  'Final Assessment',
  'Comprehensive quiz covering all training modules. 80% pass rate required.',
  'quiz',
  30,
  7,
  'assessment',
  NULL,
  true
);

-- Update quiz questions for Active Listening module
UPDATE public.safe_space_training_modules
SET quiz_questions = '[
  {
    "id": 1,
    "question": "What is the most important aspect of active listening?",
    "options": ["Giving advice quickly", "Focusing entirely on the speaker", "Thinking about your response", "Interrupting to clarify"],
    "correct_answer": 1
  },
  {
    "id": 2,
    "question": "Which of these is NOT an active listening technique?",
    "options": ["Paraphrasing", "Maintaining eye contact", "Judging the speaker", "Asking open-ended questions"],
    "correct_answer": 2
  }
]'::jsonb
WHERE title = 'Active Listening Skills';

-- Create update trigger for applications
CREATE TRIGGER update_safe_space_helper_applications_updated_at
  BEFORE UPDATE ON public.safe_space_helper_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safe_space_training_modules_updated_at
  BEFORE UPDATE ON public.safe_space_training_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safe_space_helper_training_progress_updated_at
  BEFORE UPDATE ON public.safe_space_helper_training_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();