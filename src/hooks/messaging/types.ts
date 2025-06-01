
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
}

export interface Conversation {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  last_message?: Message;
  unread_count: number;
}

export interface DatabaseMessage {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: string;
  file_url?: string | null;
  file_name?: string | null;
}
