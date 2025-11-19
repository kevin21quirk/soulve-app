# Phase 2: External Content Import - Database Migration

**Status**: ⚠️ Migration needs to be run manually

Due to Supabase authorization issues, the following database migration needs to be executed manually in your Supabase SQL Editor:

## Required SQL Migration

```sql
-- Add import metadata columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS imported_from TEXT,
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS original_author TEXT,
ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ;

-- Add indexes for querying imported posts
CREATE INDEX IF NOT EXISTS idx_posts_imported_from 
ON public.posts(imported_from) 
WHERE imported_from IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_original_url 
ON public.posts(original_url) 
WHERE original_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.posts.imported_from IS 'Platform name where content was imported from (e.g., youtube, twitter, article)';
COMMENT ON COLUMN public.posts.original_url IS 'Original source URL of imported content';
COMMENT ON COLUMN public.posts.original_author IS 'Original content creator name';
COMMENT ON COLUMN public.posts.imported_at IS 'Timestamp when content was imported';
```

## How to Run This Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/sql/new
2. Copy the SQL code above
3. Paste it into the SQL Editor
4. Click "Run" to execute the migration
5. Uncomment the import content code in `src/services/unifiedPostService.ts` (lines 65-70)

## What This Enables

Once this migration is complete, your posts will be able to store:
- **imported_from**: Platform name (youtube, twitter, article, etc.)
- **original_url**: The source URL of the imported content
- **original_author**: The original creator's name
- **imported_at**: When the content was imported

## Files Updated in Phase 2

### Edge Functions
- ✅ `supabase/functions/import-content/index.ts` - Content import service

### Services
- ✅ `src/services/contentImportService.ts` - Client-side import service
- ✅ `src/services/unifiedPostService.ts` - Updated to include import metadata (commented out until migration runs)

### Components
- ✅ `src/components/dashboard/post-creation/ImportFromURL.tsx` - Import modal UI
- ✅ `src/components/dashboard/post-creation/ImportedContentBadge.tsx` - Attribution display
- ✅ `src/components/dashboard/post-creation/components/PostActionBar.tsx` - Added Import button
- ✅ `src/components/dashboard/post-creation/components/PostContent.tsx` - Show imported content badge

### Type Definitions
- ✅ `src/components/dashboard/CreatePostTypes.ts` - Added ImportedContent interface

### Configuration
- ✅ `supabase/config.toml` - Registered import-content edge function

## Supported Platforms

The import feature currently supports:
1. **YouTube** - Video title, description, thumbnail
2. **Twitter/X** - Tweet content, author
3. **Articles** - Headlines, excerpts, featured images
4. **Generic URLs** - Fallback Open Graph parsing

## Testing After Migration

1. Click the Import button (link icon) in the post composer
2. Paste a YouTube, Twitter, or article URL
3. Click "Fetch" to preview the content
4. Click "Import This Content" to auto-fill the post form
5. Submit the post with attribution metadata

The imported content will show an attribution badge linking back to the original source.
