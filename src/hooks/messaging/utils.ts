
import { Message, DatabaseMessage } from './types';

// Type helper to convert database message to our Message interface
export const convertToMessage = (dbMessage: DatabaseMessage): Message => ({
  id: dbMessage.id,
  content: dbMessage.content,
  sender_id: dbMessage.sender_id,
  recipient_id: dbMessage.recipient_id,
  created_at: dbMessage.created_at,
  is_read: dbMessage.is_read,
  message_type: (dbMessage.message_type as 'text' | 'image' | 'file') || 'text',
  file_url: dbMessage.file_url || undefined,
  file_name: dbMessage.file_name || undefined,
});
