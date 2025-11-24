export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface UnifiedMessage {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file' | 'voice';
  file_url?: string | null;
  file_name?: string | null;
  delivered_at?: string | null;
  read_at?: string | null;
  isOwn?: boolean;
  status?: MessageStatus;
  senderName?: string;
  senderAvatar?: string;
}

export interface ConversationPartner {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface UnifiedConversation {
  id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_online?: boolean;
}

export interface ConversationWithDetails extends UnifiedConversation {
  partner_profile?: ConversationPartner;
}
