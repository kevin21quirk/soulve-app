-- Create volunteer_interests table to track volunteer offers
CREATE TABLE IF NOT EXISTS public.volunteer_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, volunteer_id)
);

-- Create support_actions table to track all types of support
CREATE TABLE IF NOT EXISTS public.support_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('volunteer', 'donate_intent', 'message', 'share')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.volunteer_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for volunteer_interests
CREATE POLICY "Users can view their own volunteer interests"
  ON public.volunteer_interests FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Post authors can view volunteer interests on their posts"
  ON public.volunteer_interests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT author_id FROM public.posts WHERE id = volunteer_interests.post_id
    )
  );

CREATE POLICY "Users can create volunteer interests"
  ON public.volunteer_interests FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Users can update their own volunteer interests"
  ON public.volunteer_interests FOR UPDATE
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Post authors can update volunteer interests status"
  ON public.volunteer_interests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT author_id FROM public.posts WHERE id = volunteer_interests.post_id
    )
  );

-- RLS Policies for support_actions
CREATE POLICY "Users can view their own support actions"
  ON public.support_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Post authors can view support actions on their posts"
  ON public.support_actions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT author_id FROM public.posts WHERE id = support_actions.post_id
    )
  );

CREATE POLICY "Users can create support actions"
  ON public.support_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_volunteer_interests_post_id ON public.volunteer_interests(post_id);
CREATE INDEX idx_volunteer_interests_volunteer_id ON public.volunteer_interests(volunteer_id);
CREATE INDEX idx_volunteer_interests_status ON public.volunteer_interests(status);
CREATE INDEX idx_support_actions_post_id ON public.support_actions(post_id);
CREATE INDEX idx_support_actions_user_id ON public.support_actions(user_id);
CREATE INDEX idx_support_actions_action_type ON public.support_actions(action_type);

-- Add trigger for updated_at
CREATE TRIGGER update_volunteer_interests_updated_at
  BEFORE UPDATE ON public.volunteer_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();