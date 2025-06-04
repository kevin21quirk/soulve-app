
import { Message, DatabaseMessage } from './types';

export const convertToMessage = (dbMessage: any): Message => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    sender_id: dbMessage.sender_id,
    recipient_id: dbMessage.recipient_id,
    created_at: dbMessage.created_at,
    is_read: dbMessage.is_read,
    message_type: dbMessage.message_type || 'text',
    attachment_url: dbMessage.attachment_url,
    attachment_name: dbMessage.attachment_name,
    attachment_size: dbMessage.attachment_size,
    attachment_type: dbMessage.attachment_type,
    sender_profile: dbMessage.sender_profile
  };
};
