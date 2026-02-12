-- Create storage bucket for ID verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'id-verifications',
  'id-verifications',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
);

-- Enable RLS on storage.objects for id-verifications bucket
CREATE POLICY "Users can upload their own ID documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'id-verifications' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'id-verifications' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'id-verifications' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Users can delete their own pending ID documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'id-verifications' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create verification_documents table
CREATE TABLE public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES public.user_verifications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'selfie')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification documents"
ON public.verification_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification documents"
ON public.verification_documents
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE INDEX idx_verification_documents_user_id ON public.verification_documents(user_id);
CREATE INDEX idx_verification_documents_verification_id ON public.verification_documents(verification_id);

-- Create audit log
CREATE TABLE public.verification_document_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.verification_documents(id) ON DELETE CASCADE NOT NULL,
  accessed_by UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'download', 'approve', 'reject')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_document_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.verification_document_audit
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.verification_document_audit
FOR INSERT
TO authenticated
WITH CHECK (true);