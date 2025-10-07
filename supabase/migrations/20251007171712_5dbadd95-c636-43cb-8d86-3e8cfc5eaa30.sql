-- Create storage buckets for organization media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('organization-avatars', 'organization-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('organization-banners', 'organization-banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']);

-- RLS policies for organization avatars
CREATE POLICY "Organization avatars are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'organization-avatars');

CREATE POLICY "Organization admins can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'organization-avatars' 
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can update avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'organization-avatars'
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can delete avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'organization-avatars'
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);

-- RLS policies for organization banners
CREATE POLICY "Organization banners are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'organization-banners');

CREATE POLICY "Organization admins can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'organization-banners'
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can update banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'organization-banners'
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);

CREATE POLICY "Organization admins can delete banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'organization-banners'
  AND auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id::text = (storage.foldername(name))[1]
    AND role IN ('admin', 'owner')
    AND is_active = true
  )
);