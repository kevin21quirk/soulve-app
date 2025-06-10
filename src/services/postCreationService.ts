import { supabase } from "@/integrations/supabase/client";
import { PostFormData, MediaFile, GifData, PollData, EventData } from "@/components/dashboard/CreatePostTypes";
import { createUnifiedPost } from "./unifiedPostService";
import { uploadMediaFiles } from "./mediaUploadService";

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

  // Upload media files if any
  let mediaUrls: string[] = [];
  if (formData.selectedMedia && formData.selectedMedia.length > 0) {
    console.log('Uploading media files:', formData.selectedMedia.length);
    const files = formData.selectedMedia.map(media => media.file);
    const uploadResults = await uploadMediaFiles(files);
    mediaUrls = uploadResults.map(result => result.url);
    console.log('Media uploaded successfully:', mediaUrls);
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

  // Store additional data in separate tables if needed
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

  return postId;
};

const storeGifData = async (postId: string, gifData: GifData) => {
  const { error } = await supabase
    .from('post_interactions')
    .insert({
      post_id: postId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      interaction_type: 'gif_attachment',
      content: JSON.stringify(gifData)
    });

  if (error) {
    console.error('Error storing GIF data:', error);
  }
};

const storePollData = async (postId: string, pollData: PollData) => {
  const { error } = await supabase
    .from('post_interactions')
    .insert({
      post_id: postId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      interaction_type: 'poll_data',
      content: JSON.stringify(pollData)
    });

  if (error) {
    console.error('Error storing poll data:', error);
  }
};

const storeEventData = async (postId: string, eventData: EventData) => {
  const { error } = await supabase
    .from('post_interactions')
    .insert({
      post_id: postId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      interaction_type: 'event_data',
      content: JSON.stringify(eventData)
    });

  if (error) {
    console.error('Error storing event data:', error);
  }
};

const storeTaggedUsers = async (postId: string, taggedUsers: string[]) => {
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

  await Promise.all(insertPromises);
};

export const getUserProfile = async (userId: string) => {
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
};
