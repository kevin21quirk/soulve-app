
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mapCategoryToDb } from "@/utils/categoryMapping";

export interface UnifiedPostData {
  title?: string;
  content: string;
  category: string;
  urgency?: string;
  location?: string;
  tags?: string[];
  visibility?: string;
  media_urls?: string[];
}

export const createUnifiedPost = async (postData: UnifiedPostData): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create posts');
  }

  console.log('unifiedPostService - Original category:', postData.category);

  // Ensure we have required fields
  if (!postData.content?.trim()) {
    throw new Error('Post content is required');
  }

  if (!postData.category?.trim()) {
    throw new Error('Post category is required');
  }

  // Map the category to database format
  const dbCategory = mapCategoryToDb(postData.category);
  console.log('unifiedPostService - Mapped category:', dbCategory);

  // Prepare the final post data
  const finalPostData = {
    title: postData.title || postData.content.split('\n')[0].substring(0, 100) || 'Untitled Post',
    content: postData.content,
    category: dbCategory,
    urgency: postData.urgency || 'medium',
    location: postData.location || null,
    tags: postData.tags || [],
    visibility: postData.visibility || 'public',
    media_urls: postData.media_urls || [],
    author_id: user.id,
    is_active: true
  };

  console.log('unifiedPostService - Final post data:', finalPostData);

  // Insert post into database
  const { data, error } = await supabase
    .from('posts')
    .insert(finalPostData)
    .select()
    .single();

  if (error) {
    console.error('unifiedPostService - Database error:', error);
    throw new Error(`Failed to create post: ${error.message}`);
  }

  console.log('unifiedPostService - Post created successfully:', data.id);
  return data.id;
};
