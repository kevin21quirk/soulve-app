
import { supabase } from "@/integrations/supabase/client";
import { PostFormData, MediaFile, GifData, PollData, EventData } from "@/components/dashboard/CreatePostTypes";

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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create posts');
  }

  // Upload media files if any
  let mediaUrls: string[] = [];
  if (formData.selectedMedia && formData.selectedMedia.length > 0) {
    mediaUrls = await uploadMediaFiles(formData.selectedMedia);
  }

  // Prepare post data
  const postData: CreatePostRequest = {
    title: formData.title || formData.description.split('\n')[0].substring(0, 100),
    content: formData.description,
    category: formData.category,
    location: formData.location,
    urgency: formData.urgency,
    tags: formData.tags,
    visibility: formData.visibility,
    media_urls: mediaUrls,
    gif_data: formData.selectedGif,
    poll_data: formData.pollData,
    event_data: formData.eventData,
    tagged_users: formData.taggedUsers,
    live_video_data: formData.liveVideoData
  };

  // Insert post into database
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      location: postData.location,
      urgency: postData.urgency,
      tags: postData.tags,
      visibility: postData.visibility,
      media_urls: postData.media_urls,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  // Store additional data in separate tables if needed
  if (postData.gif_data) {
    await storeGifData(data.id, postData.gif_data);
  }

  if (postData.poll_data) {
    await storePollData(data.id, postData.poll_data);
  }

  if (postData.event_data) {
    await storeEventData(data.id, postData.event_data);
  }

  if (postData.tagged_users && postData.tagged_users.length > 0) {
    await storeTaggedUsers(data.id, postData.tagged_users);
  }

  return data.id;
};

const uploadMediaFiles = async (mediaFiles: MediaFile[]): Promise<string[]> => {
  const uploadPromises = mediaFiles.map(async (mediaFile) => {
    const fileExt = mediaFile.file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `post-media/${fileName}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, mediaFile.file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload ${mediaFile.file.name}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
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
