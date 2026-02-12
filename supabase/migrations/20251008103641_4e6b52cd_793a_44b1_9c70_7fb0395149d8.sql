-- Add organization_id to post_interactions table
ALTER TABLE public.post_interactions 
ADD COLUMN organization_id uuid REFERENCES public.organizations(id);

-- Add organization_id to campaign_interactions table
ALTER TABLE public.campaign_interactions 
ADD COLUMN organization_id uuid REFERENCES public.organizations(id);

-- Add indexes for performance
CREATE INDEX idx_post_interactions_organization_id 
ON public.post_interactions(organization_id);

CREATE INDEX idx_campaign_interactions_organization_id 
ON public.campaign_interactions(organization_id);

COMMENT ON COLUMN public.post_interactions.organization_id IS 'Organization ID if the interaction was made on behalf of an organization';
COMMENT ON COLUMN public.campaign_interactions.organization_id IS 'Organization ID if the interaction was made on behalf of an organization';