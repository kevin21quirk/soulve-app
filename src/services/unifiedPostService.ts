
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
  organizationId?: string; // For posting as organization
  tagged_user_ids?: string[]; // Tagged users in the post
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

  // Set either author_id OR organization_id, not both
  if (postData.organizationId) {
    postToInsert.organization_id = postData.organizationId;
  } else {
    postToInsert.author_id = user.id;
  }

  // Add imported content fields if present (Phase 2)
  if ('importedContent' in postData && postData.importedContent) {
    console.log('📝 [UnifiedPost] Adding imported content:', postData.importedContent);
    postToInsert.import_source = postData.importedContent.sourcePlatform;
    postToInsert.external_id = postData.importedContent.sourceUrl;
    postToInsert.import_metadata = {
      sourceAuthor: postData.importedContent.sourceAuthor,
      sourceTitle: postData.importedContent.sourceTitle,
      thumbnailUrl: postData.importedContent.thumbnailUrl
    };
    postToInsert.imported_at = postData.importedContent.importedAt.toISOString();
    console.log('📝 [UnifiedPost] Post with import data:', {
      import_source: postToInsert.import_source,
      external_id: postToInsert.external_id,
      import_metadata: postToInsert.import_metadata
    });
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
  
  // Store tagged users and organizations if any
  if (postData.tagged_user_ids && postData.tagged_user_ids.length > 0) {
    console.log('createUnifiedPost - Storing tagged entities:', postData.tagged_user_ids);
    
    // Separate users and organizations
    const taggedUsers: string[] = [];
    const taggedOrgs: string[] = [];
    
    for (const id of postData.tagged_user_ids) {
      // Check if it's an organization
      const { data: orgData } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', id)
        .single();
      
      if (orgData) {
        taggedOrgs.push(id);
      } else {
        taggedUsers.push(id);
      }
    }

    // Insert user tags
    if (taggedUsers.length > 0) {
      const userTagInteractions = taggedUsers.map(userId => ({
        post_id: post.id,
        user_id: userId,
        interaction_type: 'user_tag',
        content: null
      }));

      const { error: userTagError } = await supabase
        .from('post_interactions')
        .insert(userTagInteractions);

      if (userTagError) {
        console.error('createUnifiedPost - Failed to store user tags:', userTagError);
      } else {
        // Create notifications for tagged users
        await createTagNotifications(taggedUsers, post.id, user.id);
      }
    }

    // Insert organization tags (use current user_id as tagger)
    if (taggedOrgs.length > 0) {
      const orgTagInteractions = taggedOrgs.map(orgId => ({
        post_id: post.id,
        user_id: user.id, // Tagger's user ID
        organization_id: orgId,
        interaction_type: 'user_tag',
        content: null
      }));

      const { error: orgTagError } = await supabase
        .from('post_interactions')
        .insert(orgTagInteractions);

      if (orgTagError) {
        console.error('createUnifiedPost - Failed to store org tags:', orgTagError);
      }
    }
  }
  
  return post.id;
};

// Notification service for tagged users
async function createTagNotifications(taggedUserIds: string[], postId: string, taggerId: string) {
  try {
    const { data: taggerProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', taggerId)
      .single();

    const taggerName = taggerProfile 
      ? `${taggerProfile.first_name} ${taggerProfile.last_name}`.trim()
      : 'Someone';

    const notifications = taggedUserIds.map(userId => ({
      recipient_id: userId,
      type: 'post_tag',
      title: 'You were tagged',
      message: `${taggerName} tagged you in a post`,
      action_url: `/posts/${postId}`,
      action_type: 'view',
      priority: 'normal',
      metadata: {
        post_id: postId,
        tagger_id: taggerId
      }
    }));

    await supabase
      .from('notifications')
      .insert(notifications);

    console.log('createUnifiedPost - Tag notifications sent to:', taggedUserIds);
  } catch (error) {
    console.error('createUnifiedPost - Failed to create tag notifications:', error);
  }
}
