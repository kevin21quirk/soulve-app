-- Add storage size and type restrictions to post-media bucket
-- This migration configures bucket-level limits to prevent storage abuse

-- Drop the old unrestricted upload policy
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;

-- Create new policy that requires authentication (limits enforced at bucket level)
CREATE POLICY "Allow authenticated users to upload files with restrictions" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-media' AND 
  auth.role() = 'authenticated'
);

-- Update bucket configuration to set maximum file size (10MB)
UPDATE storage.buckets 
SET file_size_limit = 10485760 -- 10MB in bytes
WHERE id = 'post-media';

-- Add allowed mime types for the bucket (images and videos only)
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]
WHERE id = 'post-media';