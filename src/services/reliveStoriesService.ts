
import { supabase } from '@/integrations/supabase/client';

export interface StoryUpdate {
  id: string;
  post_id: string;
  author_id: string;
  update_type: 'progress' | 'completion' | 'impact' | 'reflection';
  title: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  emotions: string[];
  stats: any;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export interface ReliveStory {
  id: string;
  post_id: string;
  title: string;
  category: string;
  cover_image?: string;
  start_date: string;
  completed_date?: string;
  total_impact: {
    pointsEarned: number;
    peopleHelped: number;
    hoursContributed: number;
    emotionalImpact: string;
  };
  preview_text?: string;
  emotions: string[];
  participants: Array<{
    user_id: string;
    role: 'creator' | 'helper' | 'beneficiary' | 'supporter';
    participation_type: 'created' | 'helped' | 'received_help' | 'supported';
    profile?: {
      first_name: string;
      last_name: string;
      avatar_url: string;
    };
  }>;
  updates: StoryUpdate[];
}

export class ReliveStoriesService {
  static async getUserStories(userId: string): Promise<ReliveStory[]> {
    const { data: stories, error } = await supabase
      .from('relive_stories')
      .select(`
        *,
        story_participants!inner(
          user_id,
          role,
          participation_type,
          profiles(first_name, last_name, avatar_url)
        )
      `)
      .eq('story_participants.user_id', userId)
      .order('completed_date', { ascending: false });

    if (error) throw error;

    // Get story updates for each story
    const storiesWithUpdates = await Promise.all(
      (stories || []).map(async (story) => {
        const { data: updates } = await supabase
          .from('story_updates')
          .select(`
            *,
            profiles(first_name, last_name, avatar_url)
          `)
          .eq('post_id', story.post_id)
          .order('created_at', { ascending: true });

        const { data: participants } = await supabase
          .from('story_participants')
          .select(`
            user_id,
            role,
            participation_type,
            profiles(first_name, last_name, avatar_url)
          `)
          .eq('post_id', story.post_id);

        return {
          ...story,
          participants: participants || [],
          updates: updates?.map(update => ({
            ...update,
            author: update.profiles
          })) || []
        };
      })
    );

    return storiesWithUpdates;
  }

  static async createStoryUpdate(
    postId: string,
    updateData: {
      update_type: 'progress' | 'completion' | 'impact' | 'reflection';
      title: string;
      content: string;
      media_url?: string;
      media_type?: 'image' | 'video';
      emotions?: string[];
      stats?: any;
    }
  ): Promise<StoryUpdate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('story_updates')
      .insert({
        post_id: postId,
        author_id: user.id,
        ...updateData
      })
      .select(`
        *,
        profiles(first_name, last_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      author: data.profiles
    };
  }

  static async getStoryByPostId(postId: string): Promise<ReliveStory | null> {
    const { data: story, error } = await supabase
      .from('relive_stories')
      .select('*')
      .eq('post_id', postId)
      .single();

    if (error) return null;

    const { data: updates } = await supabase
      .from('story_updates')
      .select(`
        *,
        profiles(first_name, last_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    const { data: participants } = await supabase
      .from('story_participants')
      .select(`
        user_id,
        role,
        participation_type,
        profiles(first_name, last_name, avatar_url)
      `)
      .eq('post_id', postId);

    return {
      ...story,
      participants: participants || [],
      updates: updates?.map(update => ({
        ...update,
        author: update.profiles
      })) || []
    };
  }

  static async getAllPublicStories(): Promise<ReliveStory[]> {
    const { data: stories, error } = await supabase
      .from('relive_stories')
      .select(`
        *,
        posts!inner(visibility)
      `)
      .eq('posts.visibility', 'public')
      .order('completed_date', { ascending: false });

    if (error) throw error;

    // Get story updates and participants for each story
    const storiesWithData = await Promise.all(
      (stories || []).map(async (story) => {
        const { data: updates } = await supabase
          .from('story_updates')
          .select(`
            *,
            profiles(first_name, last_name, avatar_url)
          `)
          .eq('post_id', story.post_id)
          .order('created_at', { ascending: true });

        const { data: participants } = await supabase
          .from('story_participants')
          .select(`
            user_id,
            role,
            participation_type,
            profiles(first_name, last_name, avatar_url)
          `)
          .eq('post_id', story.post_id);

        return {
          ...story,
          participants: participants || [],
          updates: updates?.map(update => ({
            ...update,
            author: update.profiles
          })) || []
        };
      })
    );

    return storiesWithData;
  }
}
