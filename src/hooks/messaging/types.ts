
export interface DatabaseMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'voice';
  file_url?: string | null;
  file_name?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: number;
  attachment_type?: string;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface Conversation {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  last_message?: {
    content: string;
    created_at: string;
  };
  unread_count: number;
  // Additional properties for compatibility
  partner_id: string;
  partner_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  last_message_time: string;
  is_read: boolean;
}
