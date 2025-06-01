
import { Message, DatabaseMessage } from './types';

// Helper function to safely convert message type
const convertMessageType = (messageType: string): 'text' | 'image' | 'file' => {
  switch (messageType) {
    case 'image':
      return 'image';
    case 'file':
      return 'file';
    case 'voice':
      return 'file'; // Convert voice to file for compatibility
    default:
      return 'text';
  }
};

// Type helper to convert database message to our Message interface
export const convertToMessage = (dbMessage: any): Message => ({
  id: dbMessage.id,
  content: dbMessage.content,
  sender_id: dbMessage.sender_id,
  recipient_id: dbMessage.recipient_id,
  created_at: dbMessage.created_at,
  is_read: dbMessage.is_read,
  message_type: convertMessageType(dbMessage.message_type),
  file_url: dbMessage.file_url || undefined,
  file_name: dbMessage.file_name || undefined,
});
