-- Tutorial progress tracking
CREATE TABLE user_tutorial_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tutorial_type text NOT NULL,
  user_type text NOT NULL,
  steps_completed jsonb DEFAULT '[]'::jsonb,
  total_steps integer NOT NULL,
  current_step integer DEFAULT 1,
  is_completed boolean DEFAULT false,
  dismissed boolean DEFAULT false,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  last_step_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Tutorial preferences
CREATE TABLE tutorial_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_tutorials boolean DEFAULT true,
  dismissed_tutorials text[] DEFAULT ARRAY[]::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tutorial_progress
CREATE POLICY "Users can view own tutorial progress"
  ON user_tutorial_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutorial progress"
  ON user_tutorial_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tutorial progress"
  ON user_tutorial_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tutorial progress"
  ON user_tutorial_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tutorial_preferences
CREATE POLICY "Users can view own tutorial preferences"
  ON tutorial_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutorial preferences"
  ON tutorial_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tutorial preferences"
  ON tutorial_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tutorial preferences"
  ON tutorial_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_tutorial_progress_user_id ON user_tutorial_progress(user_id);
CREATE INDEX idx_user_tutorial_progress_tutorial_type ON user_tutorial_progress(tutorial_type);
CREATE INDEX idx_tutorial_preferences_user_id ON tutorial_preferences(user_id);