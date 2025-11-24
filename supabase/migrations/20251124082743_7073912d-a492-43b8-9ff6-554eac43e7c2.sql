-- Add message delivery tracking fields
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_messages_delivered_at ON messages(delivered_at);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);

-- Create user presence tracking table
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  typing_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  typing_started_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time for user_presence
ALTER TABLE user_presence REPLICA IDENTITY FULL;

-- Add user_presence to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- Auto-expire typing indicators function
CREATE OR REPLACE FUNCTION expire_typing_indicator()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear typing indicator after 3 seconds of inactivity
  IF NEW.typing_started_at IS NOT NULL AND NEW.typing_started_at < NOW() - INTERVAL '3 seconds' THEN
    NEW.typing_to_user_id := NULL;
    NEW.typing_started_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for expiring typing indicators
DROP TRIGGER IF EXISTS trigger_expire_typing ON user_presence;
CREATE TRIGGER trigger_expire_typing
BEFORE UPDATE ON user_presence
FOR EACH ROW EXECUTE FUNCTION expire_typing_indicator();

-- RLS policies for user_presence
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- Users can read all presence (for simplicity and performance)
DROP POLICY IF EXISTS "Users can read presence" ON user_presence;
CREATE POLICY "Users can read presence" ON user_presence
FOR SELECT USING (true);

-- Users can update their own presence
DROP POLICY IF EXISTS "Users can update own presence" ON user_presence;
CREATE POLICY "Users can update own presence" ON user_presence
FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own presence
DROP POLICY IF EXISTS "Users can insert own presence" ON user_presence;
CREATE POLICY "Users can insert own presence" ON user_presence
FOR INSERT WITH CHECK (auth.uid() = user_id);