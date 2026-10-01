-- Fix Supabase Storage RLS policies for banners bucket
-- This will allow authenticated users to upload profile banners

-- Step 1: Check if banners bucket exists
SELECT id, name, public FROM storage.buckets WHERE name = 'banners';

-- Step 2: Create banners bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banners" ON storage.objects;

-- Step 4: Create RLS policies for banners bucket

-- Allow public viewing of all banners
CREATE POLICY "Users can view banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Allow authenticated users to upload banners to their own folder
CREATE POLICY "Users can upload their own banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own banners
CREATE POLICY "Users can update their own banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own banners
CREATE POLICY "Users can delete their own banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Step 5: Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%banner%'
ORDER BY policyname;
