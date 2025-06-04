
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createCampaign, CampaignFormData } from '@/services/campaignService';
import { useAuth } from '@/contexts/AuthContext';
import AutoCampaignPublisher from './AutoCampaignPublisher';
import CampaignFormFields from './CampaignFormFields';

const EnhancedCampaignBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    story: '',
    category: 'fundraising' as const,
    organization_type: 'individual' as const,
    goal_type: 'monetary' as const,
    goal_amount: 0,
    currency: 'USD',
    end_date: '',
    location: '',
    urgency: 'medium' as const,
    visibility: 'public' as const,
    allow_anonymous_donations: true,
    enable_comments: true,
    enable_updates: true,
    featured_image: '',
    gallery_images: [],
    tags: [],
    social_links: {},
    custom_fields: {},
    promotion_budget: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a campaign.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const campaign = await createCampaign(formData);
      
      // Trigger auto-publish to feed
      const campaignUpdate = {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        campaignId: campaign.id,
        author: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        type: campaign.category,
        location: campaign.location,
        tags: campaign.tags
      };
      
      setCreatedCampaign(campaignUpdate);
      
      toast({
        title: "Campaign created successfully!",
        description: "Your campaign has been published and shared in the community feed.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        story: '',
        category: 'fundraising' as const,
        organization_type: 'individual' as const,
        goal_type: 'monetary' as const,
        goal_amount: 0,
        currency: 'USD',
        end_date: '',
        location: '',
        urgency: 'medium' as const,
        visibility: 'public' as const,
        allow_anonymous_donations: true,
        enable_comments: true,
        enable_updates: true,
        featured_image: '',
        gallery_images: [],
        tags: [],
        social_links: {},
        custom_fields: {},
        promotion_budget: 0
      });
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCampaignPublished = () => {
    setCreatedCampaign(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CampaignFormFields
              formData={formData}
              onFormDataChange={setFormData}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title || !formData.description}
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AutoCampaignPublisher
        campaign={createdCampaign}
        onPublished={handleCampaignPublished}
      />
    </>
  );
};

export default EnhancedCampaignBuilder;
