
import { supabase } from "@/integrations/supabase/client";
import { PostFormData, MediaFile, GifData, PollData, EventData } from "@/components/dashboard/CreatePostTypes";
import { createUnifiedPost } from "./unifiedPostService";
import { uploadMediaFiles } from "./mediaUploadService";
import { useToast } from "@/hooks/use-toast";

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  location?: string;
  urgency: string;
  tags: string[];
  visibility: string;
  media_urls?: string[];
  gif_data?: GifData;
  poll_data?: PollData;
  event_data?: EventData;
  tagged_users?: string[];
  live_video_data?: any;
}

export const createPost = async (formData: PostFormData): Promise<string> => {
  console.log('postCreationService - Starting post creation with formData:', formData);

  try {
    // Upload media files if any
    let mediaUrls: string[] = [];
    if (formData.selectedMedia && formData.selectedMedia.length > 0) {
      console.log('Uploading media files:', formData.selectedMedia.length);
      
      try {
        const files = formData.selectedMedia.map(media => media.file);
        const uploadResults = await uploadMediaFiles(files);
        mediaUrls = uploadResults.map(result => result.url);
        console.log('Media uploaded successfully:', mediaUrls);
      } catch (uploadError) {
        console.error('Media upload failed:', uploadError);
        throw new Error(`Failed to upload media: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    }

    // Use the unified post service for consistent creation
    const postId = await createUnifiedPost({
      title: formData.title,
      content: formData.description,
      category: formData.category,
      urgency: formData.urgency,
      location: formData.location,
      tags: formData.tags,
      visibility: formData.visibility,
      media_urls: mediaUrls
    });

    console.log('Post created successfully with ID:', postId);

    // Store additional data in separate tables if needed
    try {
      if (formData.selectedGif) {
        await storeGifData(postId, formData.selectedGif);
      }

      if (formData.pollData) {
        await storePollData(postId, formData.pollData);
      }

      if (formData.eventData) {
        await storeEventData(postId, formData.eventData);
      }

      if (formData.taggedUsers && formData.taggedUsers.length > 0) {
        await storeTaggedUsers(postId, formData.taggedUsers);
      }
    } catch (additionalDataError) {
      console.warn('Error storing additional post data:', additionalDataError);
      // Don't fail the entire post creation for additional data errors
    }

    return postId;
  } catch (error) {
    console.error('postCreationService - Error creating post:', error);
    throw error;
  }
};

const storeGifData = async (postId: string, gifData: GifData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('post_interactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        interaction_type: 'gif_attachment',
        content: JSON.stringify(gifData)
      });

    if (error) {
      console.error('Error storing GIF data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in storeGifData:', error);
    throw error;
  }
};

const storePollData = async (postId: string, pollData: PollData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('post_interactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        interaction_type: 'poll_data',
        content: JSON.stringify(pollData)
      });

    if (error) {
      console.error('Error storing poll data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in storePollData:', error);
    throw error;
  }
};

const storeEventData = async (postId: string, eventData: EventData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('post_interactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        interaction_type: 'event_data',
        content: JSON.stringify(eventData)
      });

    if (error) {
      console.error('Error storing event data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in storeEventData:', error);
    throw error;
  }
};

const storeTaggedUsers = async (postId: string, taggedUsers: string[]) => {
  try {
    const insertPromises = taggedUsers.map(userId => 
      supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: userId,
          interaction_type: 'user_tag',
          content: null
        })
    );

    const results = await Promise.all(insertPromises);
    
    // Check for any errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Errors storing tagged users:', errors);
      throw new Error('Failed to store some tagged users');
    }
  } catch (error) {
    console.error('Error in storeTaggedUsers:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
