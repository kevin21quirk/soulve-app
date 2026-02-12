-- Phase 1: Add deleted_at field to conversation_participants for per-user conversation hiding
ALTER TABLE conversation_participants 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for faster queries when filtering hidden conversations
CREATE INDEX idx_conversation_participants_deleted 
ON conversation_participants(user_id, deleted_at);

-- Add comment to explain the feature
COMMENT ON COLUMN conversation_participants.deleted_at IS 'Timestamp when this user hid the conversation. NULL means conversation is visible. When a new message arrives, this is set back to NULL to unhide the conversation.';