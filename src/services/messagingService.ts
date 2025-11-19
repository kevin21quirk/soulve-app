import { supabase } from "@/integrations/supabase/client";
import { UnifiedConversation, UnifiedMessage } from "@/types/unified-messaging";

export const getConversations = async (userId: string): Promise<UnifiedConversation[]> => {
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

  // Group by conversation partner
  const conversationsMap = new Map<string, UnifiedConversation>();

  for (const msg of messages || []) {
    const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
    
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
