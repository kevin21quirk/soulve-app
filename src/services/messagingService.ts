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

    // Get deletion thresholds for this user (Messenger-like behavior)
    const deletionThresholds = new Map<string, string>();
    
    try {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, deleted_at')
        .eq('user_id', userId)
        .not('deleted_at', 'is', null);

      if (participants) {
        // Map conversation_id to deletion timestamp
        for (const p of participants) {
          deletionThresholds.set(p.conversation_id, p.deleted_at);
        }
      }
    } catch (error) {
      console.warn('[getConversations] Failed to load deletion thresholds:', error);
    }

    // Group by conversation partner
    const conversationsMap = new Map<string, UnifiedConversation>();

    for (const msg of messages || []) {
      const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      
      // Check if conversation was deleted and if this message is after deletion
      const conversationId = await getOrCreateConversation(userId, partnerId);
      const deletionThreshold = deletionThresholds.get(conversationId);
      
      if (deletionThreshold) {
        // Skip messages before deletion threshold
        if (new Date(msg.created_at) <= new Date(deletionThreshold)) {
          continue;
        }
      }
      
      if (!conversationsMap.has(partnerId)) {
        // Get partner profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', partnerId)
          .maybeSingle();

        const partnerName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
          : 'Unknown User';

        // Count unread messages from this partner (only after deletion threshold)
        const unreadCount = messages.filter(m => {
          if (m.sender_id !== partnerId || m.recipient_id !== userId || m.is_read) return false;
          
          // Only count if after deletion threshold
          if (deletionThreshold) {
            return new Date(m.created_at) > new Date(deletionThreshold);
          }
          return true;
        }).length;

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
  // Get deletion threshold for this user (Messenger-like behavior)
  const conversationId = await getOrCreateConversation(userId, partnerId);
  
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('deleted_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  const deletionThreshold = participant?.deleted_at;

  // Build query - only show messages AFTER deletion timestamp if exists
  let query = supabase
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
      file_name,
      delivered_at,
      read_at
    `)
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`);

  // Filter out messages before deletion (permanent deletion from this user's view)
  if (deletionThreshold) {
    query = query.gt('created_at', deletionThreshold);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) throw error;

  // Get partner profile for sender name/avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', partnerId)
    .maybeSingle();

  const partnerName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown'
    : 'Unknown';

  return (data || []).map(msg => ({
    ...msg,
    message_type: msg.message_type as 'text' | 'image' | 'file' | 'voice',
    isOwn: msg.sender_id === userId,
    status: (
      msg.read_at ? 'read' : 
      msg.delivered_at ? 'delivered' : 
      'sent'
    ) as 'read' | 'delivered' | 'sent',
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
  // Conversation will reappear automatically if there are new messages after deletion
  // We don't reset deleted_at - it acts as a permanent threshold timestamp
  
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

// Mark messages as delivered (called when recipient receives message)
export const markAsDelivered = async (messageIds: string[]) => {
  const { error } = await supabase
    .from('messages')
    .update({ delivered_at: new Date().toISOString() })
    .in('id', messageIds)
    .is('delivered_at', null); // Only update if not already delivered

  if (error) throw error;
};

// Mark messages as read (includes read timestamp)
export const markAsRead = async (messageIds: string[]) => {
  const { error } = await supabase
    .from('messages')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
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

// Helper: Get deletion threshold timestamp for a conversation (Messenger-like behavior)
// Returns null if not deleted, or the timestamp when user deleted the conversation
const getConversationDeletionThreshold = async (userId: string, partnerId: string): Promise<string | null> => {
  const conversationId = await getOrCreateConversation(userId, partnerId);
  
  const { data } = await supabase
    .from('conversation_participants')
    .select('deleted_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();
  
  return data?.deleted_at || null;
};

export const deleteConversation = async (userId: string, partnerId: string) => {
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
    .maybeSingle();

  if (error) throw error;
  return data;
};
