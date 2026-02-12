-- Drop the existing unique index that prevents any duplicate imports
DROP INDEX IF EXISTS idx_posts_import_source_external_id;

-- Create a new unique index that allows different users to import the same content
-- but prevents the same user from importing the same content twice
CREATE UNIQUE INDEX idx_posts_user_import_source_external_id 
ON posts(author_id, import_source, external_id) 
WHERE import_source IS NOT NULL AND external_id IS NOT NULL;

-- Add a helpful comment
COMMENT ON INDEX idx_posts_user_import_source_external_id IS 
'Prevents the same user from importing the same content twice, but allows different users to import the same content';