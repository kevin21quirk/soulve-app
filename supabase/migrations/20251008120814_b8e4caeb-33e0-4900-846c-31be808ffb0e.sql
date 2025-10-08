-- Add facial recognition columns to user_verifications table
ALTER TABLE public.user_verifications 
ADD COLUMN IF NOT EXISTS face_match_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS liveness_check_passed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS face_embedding JSONB;

-- Add facial recognition columns to verification_documents table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'verification_documents' 
                 AND column_name = 'face_detected') THEN
    ALTER TABLE public.verification_documents 
    ADD COLUMN face_detected BOOLEAN DEFAULT false,
    ADD COLUMN face_quality_score DECIMAL(3,2);
  END IF;
END $$;

-- Create index for face match scores for faster queries
CREATE INDEX IF NOT EXISTS idx_user_verifications_face_match_score 
ON public.user_verifications(face_match_score) 
WHERE face_match_score IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.user_verifications.face_match_score IS 'Facial recognition similarity score between ID photo and selfie (0.00-1.00)';
COMMENT ON COLUMN public.user_verifications.liveness_check_passed IS 'Whether the user passed liveness detection checks';
COMMENT ON COLUMN public.user_verifications.face_embedding IS 'Encrypted facial feature embeddings for comparison';