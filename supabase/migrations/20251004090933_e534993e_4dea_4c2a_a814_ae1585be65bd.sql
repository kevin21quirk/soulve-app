-- Create storage bucket for ESG documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('esg-documents', 'esg-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for ESG documents storage
CREATE POLICY "Organization members can upload ESG documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'esg-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Organization members can view their ESG documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'esg-documents'
  AND (
    -- User uploaded it
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- User is member of organization
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.user_id = auth.uid()
        AND om.organization_id::text = (storage.foldername(name))[1]
        AND om.is_active = true
    )
  )
);

CREATE POLICY "Organization members can delete their ESG documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'esg-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);