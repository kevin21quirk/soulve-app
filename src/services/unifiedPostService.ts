
import { supabase } from '@/integrations/supabase/client';
import { ContentModerationService } from './contentModerationService';
import { ImportedContent } from '@/components/dashboard/CreatePostTypes';

interface CreatePostData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
  importedContent?: ImportedContent;
}

export const createUnifiedPost = async (postData: CreatePostData) => {
  console.log('createUnifiedPost - Starting with data:', postData);
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Content moderation check
  try {
    const moderationResult = await ContentModerationService.filterContent(
      postData.content,
      postData.title
    );

    // Block if content is not allowed
    if (!moderationResult.isAllowed) {
      throw new Error(`Content blocked: ${moderationResult.reasons.join(', ')}`);
    }

    // Log if content is flagged but allowed
    if (moderationResult.autoAction === 'flag') {
      console.log('Content flagged for review:', moderationResult.reasons);
    }
  } catch (moderationError) {
    console.error('Content moderation failed:', moderationError);
    // Continue with post creation but log the error
    // In production, you might want to flag these for manual review
  }

  // Create the post with imported content metadata
  const postToInsert: any = {
    author_id: user.id,
    title: postData.title || '',
    content: postData.content,
    category: postData.category,
    location: postData.location || '',
    urgency: postData.urgency || 'medium',
    tags: postData.tags || [],
    visibility: postData.visibility || 'public',
    media_urls: postData.media_urls || [],
    is_active: true
  };

  // Add imported content fields if present (Phase 2)
  if ('importedContent' in postData && postData.importedContent) {
    postToInsert.import_source = postData.importedContent.sourcePlatform;
    postToInsert.external_id = postData.importedContent.sourceUrl;
    postToInsert.import_metadata = {
      sourceAuthor: postData.importedContent.sourceAuthor,
      sourceTitle: postData.importedContent.sourceTitle,
      thumbnailUrl: postData.importedContent.thumbnailUrl
    };
    postToInsert.imported_at = postData.importedContent.importedAt.toISOString();
  }

  console.log('createUnifiedPost - Inserting post:', postToInsert);

  const { data: post, error: insertError } = await supabase
    .from('posts')
    .insert(postToInsert)
    .select()
    .single();

  if (insertError) {
    console.error('createUnifiedPost - Insert error:', insertError);
    throw new Error(`Failed to create post: ${insertError.message}`);
  }

  console.log('createUnifiedPost - Post created successfully:', post.id);
  return post.id;
};
