import { supabase } from '@/integrations/supabase/client';

export interface InteractionTarget {
  isCampaign: boolean;
  actualId: string;
  tableName: 'post_interactions' | 'campaign_interactions';
  idColumnName: 'post_id' | 'campaign_id';
}

/**
 * Determines whether an ID is a campaign or post and returns routing information
 */
export const getInteractionTarget = (id: string): InteractionTarget => {
  const isCampaign = id.startsWith('campaign_');
  const actualId = isCampaign ? id.replace('campaign_', '') : id;
  
  return {
    isCampaign,
    actualId,
    tableName: isCampaign ? 'campaign_interactions' : 'post_interactions',
    idColumnName: isCampaign ? 'campaign_id' : 'post_id'
  };
};

/**
 * Creates an interaction (like, comment, bookmark, share) for either a post or campaign
 */
export const createInteraction = async (
  id: string,
  userId: string,
  interactionType: 'like' | 'comment' | 'bookmark' | 'share',
  content?: string
) => {
  const target = getInteractionTarget(id);
  
  if (target.isCampaign) {
    const { error } = await supabase
      .from('campaign_interactions')
      .insert({
        campaign_id: target.actualId,
        user_id: userId,
        interaction_type: interactionType,
        ...(content && { content })
      });
    
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('post_interactions')
      .insert({
        post_id: target.actualId,
        user_id: userId,
        interaction_type: interactionType,
        ...(content && { content })
      });
    
    if (error) throw error;
  }
};

/**
 * Fetches comments for either a post or campaign
 */
export const fetchComments = async (id: string, userId?: string) => {
  const target = getInteractionTarget(id);
  
  // For now, use the existing RPC for posts
  // For campaigns, query campaign_interactions directly
  if (target.isCampaign) {
    const { data, error } = await supabase
      .from('campaign_interactions')
      .select(`
        id,
        campaign_id,
        user_id,
        content,
        created_at,
        updated_at,
        parent_id,
        is_deleted
      `)
      .eq('campaign_id', target.actualId)
      .eq('interaction_type', 'comment')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get profiles for comment authors
    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Transform to match RPC output format
    return data.map(comment => {
      const profile = profileMap.get(comment.user_id);
      const authorName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
        : 'Anonymous';

      return {
        id: comment.id,
        post_id: target.actualId,
        user_id: comment.user_id,
        parent_comment_id: comment.parent_id,
        content: comment.content,
        created_at: comment.created_at,
        edited_at: comment.updated_at !== comment.created_at ? comment.updated_at : null,
        is_deleted: comment.is_deleted,
        author_name: authorName,
        author_avatar: profile?.avatar_url || null,
        likes_count: 0, // TODO: Add likes count query
        user_has_liked: false // TODO: Add user like status query
      };
    });
  } else {
    // Use existing RPC for posts
    const { data, error } = await supabase
      .rpc('get_post_comments', { target_post_id: target.actualId });

    if (error) throw error;
    return data;
  }
};
