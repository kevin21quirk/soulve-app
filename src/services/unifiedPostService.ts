
import { supabase } from '@/integrations/supabase/client';
import { ContentModerationService } from './contentModerationService';

interface CreatePostData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
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

  // Create the post
  const postToInsert = {
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
