
-- Create the post-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-media' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow users to view all files in post-media bucket
CREATE POLICY "Allow public access to post-media files" ON storage.objects
FOR SELECT USING (bucket_id = 'post-media');

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'post-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'post-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
