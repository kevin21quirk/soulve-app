-- Create campaign_interactions table mirroring post_interactions structure
CREATE TABLE public.campaign_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  interaction_type TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_id UUID REFERENCES public.campaign_interactions(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.campaign_interactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_campaign_interactions_campaign_id ON public.campaign_interactions(campaign_id);
CREATE INDEX idx_campaign_interactions_user_id ON public.campaign_interactions(user_id);
CREATE INDEX idx_campaign_interactions_parent_id ON public.campaign_interactions(parent_id);
CREATE INDEX idx_campaign_interactions_created_at ON public.campaign_interactions(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can view campaign interactions"
ON public.campaign_interactions
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create campaign interactions"
ON public.campaign_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign interactions"
ON public.campaign_interactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaign interactions"
ON public.campaign_interactions
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_campaign_interactions_updated_at
BEFORE UPDATE ON public.campaign_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_interactions;