-- Phase 2: Business Report Archive System
-- Create storage bucket for ESG reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('esg-reports', 'esg-reports', false, 52428800, ARRAY['application/pdf', 'text/html', 'application/json']::text[])
ON CONFLICT (id) DO NOTHING;

-- Update esg_reports schema for file storage
ALTER TABLE esg_reports 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS html_url TEXT,
ADD COLUMN IF NOT EXISTS file_size_bytes INTEGER,
ADD COLUMN IF NOT EXISTS report_format TEXT DEFAULT 'html',
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Create report versions table for tracking
CREATE TABLE IF NOT EXISTS esg_report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES esg_reports(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot_data JSONB,
  pdf_url TEXT,
  html_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- Enable RLS on report versions
ALTER TABLE esg_report_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for report versions
CREATE POLICY "Organization members can view report versions"
ON esg_report_versions FOR SELECT
USING (
  report_id IN (
    SELECT er.id FROM esg_reports er
    JOIN organization_members om ON er.organization_id = om.organization_id
    WHERE om.user_id = auth.uid() AND om.is_active = true
  )
);

-- Storage policies for ESG reports bucket
CREATE POLICY "Org members can view reports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'esg-reports' 
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Org admins can upload reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'esg-reports'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

CREATE POLICY "Org admins can update reports"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'esg-reports'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

CREATE POLICY "Org admins can delete reports"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'esg-reports'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner') 
    AND is_active = true
  )
);

-- Function to track downloads
CREATE OR REPLACE FUNCTION increment_report_download()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE esg_reports
  SET download_count = download_count + 1
  WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-archive old reports (7 years)
CREATE OR REPLACE FUNCTION archive_old_reports()
RETURNS void AS $$
BEGIN
  UPDATE esg_reports 
  SET archived_at = now()
  WHERE created_at < (now() - INTERVAL '7 years')
  AND archived_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;