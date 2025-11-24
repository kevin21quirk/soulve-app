import { supabase } from "@/integrations/supabase/client";
import { UnifiedConversation, UnifiedMessage } from "@/types/unified-messaging";

export const getConversations = async (userId: string): Promise<UnifiedConversation[]> => {
  try {
    // Get all messages where user is sender or recipient
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        created_at,
        is_read
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Pre-compute which partners are hidden for this user
    let hiddenPartnerIds = new Set<string>();
    
    try {
      // Step 1: Get all hidden conversation IDs for this user
      const { data: hiddenConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)
        .not('deleted_at', 'is', null);

      if (hiddenConversations && hiddenConversations.length > 0) {
        const hiddenConvIds = hiddenConversations.map(c => c.conversation_id);
        
        // Step 2: Get the partner user_ids from those conversations
        const { data: hiddenPartners } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .in('conversation_id', hiddenConvIds)
          .neq('user_id', userId);

        if (hiddenPartners) {
          hiddenPartnerIds = new Set(hiddenPartners.map(p => p.user_id));
        }
      }
    } catch (hiddenError) {
      // If hidden lookup fails, log it but continue showing all conversations
      console.warn('[getConversations] Failed to load hidden conversations, showing all:', hiddenError);
    }

    // Group by conversation partner
    const conversationsMap = new Map<string, UnifiedConversation>();

    for (const msg of messages || []) {
      const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      
      // Skip if this partner's conversation is hidden
      if (hiddenPartnerIds.has(partnerId)) continue;
      
      if (!conversationsMap.has(partnerId)) {
        // Get partner profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', partnerId)
          .single();

        const partnerName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
          : 'Unknown User';

        // Count unread messages from this partner
        const unreadCount = messages.filter(
          m => m.sender_id === partnerId && m.recipient_id === userId && !m.is_read
        ).length;

        conversationsMap.set(partnerId, {
          id: partnerId,
          partner_id: partnerId,
          partner_name: partnerName,
          partner_avatar: profile?.avatar_url,
          last_message: msg.content,
          last_message_time: msg.created_at,
          unread_count: unreadCount,
        });
      }
    }

    return Array.from(conversationsMap.values());
  } catch (error) {
    console.error('[getConversations] Critical error:', error);
    throw error;
  }
};

export const getMessages = async (
  partnerId: string,
  userId: string
): Promise<UnifiedMessage[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      recipient_id,
      content,
      created_at,
      is_read,
      message_type,
      file_url,
      file_name
    `)
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Get partner profile for sender name/avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', partnerId)
    .single();

  const partnerName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown'
    : 'Unknown';

  return (data || []).map(msg => ({
    ...msg,
    message_type: msg.message_type as 'text' | 'image' | 'file' | 'voice',
    isOwn: msg.sender_id === userId,
    status: (msg.is_read ? 'read' : 'sent') as 'read' | 'sent',
    senderName: msg.sender_id === userId ? 'You' : partnerName,
    senderAvatar: msg.sender_id === userId ? undefined : profile?.avatar_url,
  }));
};

export const sendMessage = async (data: {
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'voice';
  file_url?: string;
  file_name?: string;
}) => {
  // Auto-unhide conversation for recipient when new message arrives
  const conversationId = await getOrCreateConversation(data.sender_id, data.recipient_id);
  
  await supabase
    .from('conversation_participants')
    .update({ deleted_at: null })
    .eq('conversation_id', conversationId)
    .eq('user_id', data.recipient_id);
  
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      sender_id: data.sender_id,
      recipient_id: data.recipient_id,
      content: data.content,
      message_type: data.message_type || 'text',
      file_url: data.file_url,
      file_name: data.file_name,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return message;
};

export const markAsRead = async (messageIds: string[]) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .in('id', messageIds);

  if (error) throw error;
};

export const subscribeToMessages = (
  userId: string,
  onMessage: (message: any) => void
) => {
  const channel = supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => onMessage(payload.new)
    )
    .subscribe();

  return channel;
};

// Helper: Get or create conversation between two users using database function
const getOrCreateConversation = async (userId: string, partnerId: string): Promise<string> => {
  const { data, error } = await supabase
    .rpc('get_or_create_conversation', {
      user1_id: userId,
      user2_id: partnerId
    });
  
  if (error) {
    console.error('[getOrCreateConversation] Error:', error);
    throw error;
  }
  
  return data;
};

// Helper: Check if conversation is hidden by user
const isConversationHidden = async (userId: string, partnerId: string): Promise<boolean> => {
  const conversationId = await getOrCreateConversation(userId, partnerId);
  
  const { data } = await supabase
    .from('conversation_participants')
    .select('deleted_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();
  
  return data?.deleted_at !== null;
};

export const hideConversation = async (userId: string, partnerId: string) => {
  const conversationId = await getOrCreateConversation(userId, partnerId);
  
  const { error } = await supabase
    .from('conversation_participants')
    .update({ deleted_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);
  
  if (error) throw error;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};
