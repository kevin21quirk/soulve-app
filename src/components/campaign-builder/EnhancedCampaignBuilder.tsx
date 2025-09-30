import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
import { CampaignFormData } from '@/services/campaignService';
import AutoCampaignPublisher from './AutoCampaignPublisher';
import EnhancedCampaignBuilderHeader from './EnhancedCampaignBuilderHeader';
import EnhancedCampaignBuilderTabs from './EnhancedCampaignBuilderTabs';

const EnhancedCampaignBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    // Pre-fill form with template data, mapping organization types correctly
    const mappedOrgType = template.organization_type === 'community_group' ? 'community_group' : 
                         template.organization_type === 'social_group' ? 'social_group' :
                         template.organization_type as CampaignFormData['organization_type'];
    
    setFormData({
      ...formData,
      title: template.template_data.title,
      description: template.template_data.description,
      story: template.template_data.story,
      category: template.category,
      organization_type: mappedOrgType,
      goal_type: template.template_data.goal_type,
      goal_amount: template.template_data.suggested_goal_amount || 0,
      urgency: template.template_data.urgency,
      tags: template.template_data.tags || []
    });
    setShowForm(true);
    setActiveTab("templates");
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    // Reset form to defaults
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
    setShowForm(true);
    setActiveTab("templates");
  };

  const handleFormDataChange = (data: CampaignFormData) => {
    setFormData(data);
  };

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
      // Insert campaign into database with explicit active status
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          title: formData.title,
          description: formData.description,
          story: formData.story,
          category: formData.category,
          organization_type: formData.organization_type,
          goal_type: formData.goal_type,
          goal_amount: formData.goal_amount,
          currency: formData.currency,
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
          location: formData.location,
          urgency: formData.urgency,
          visibility: formData.visibility,
          allow_anonymous_donations: formData.allow_anonymous_donations,
          enable_comments: formData.enable_comments,
          enable_updates: formData.enable_updates,
          featured_image: formData.featured_image,
          gallery_images: formData.gallery_images,
          tags: formData.tags,
          social_links: formData.social_links,
          custom_fields: formData.custom_fields,
          promotion_budget: formData.promotion_budget,
          creator_id: user.id,
          status: 'active', // Explicitly set to active
          current_amount: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      // Trigger auto-publish to feed with enhanced data
      const campaignUpdate = {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        campaignId: campaign.id,
        author: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        type: campaign.category,
        location: campaign.location,
        tags: campaign.tags,
        status: campaign.status
      };
      
      setCreatedCampaign(campaignUpdate);
      
      toast({
        title: "Campaign created and published!",
        description: `Your campaign "${campaign.title}" is now live and visible in the community feed.`,
      });

      // Trigger an immediate broadcast to notify other components
      window.dispatchEvent(new CustomEvent('campaignCreated', { 
        detail: { campaign: campaignUpdate } 
      }));

      // Reset form and go back to templates
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
      setShowForm(false);
      setSelectedTemplate(null);
      setActiveTab("templates");
      
    } catch (error) {
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

  const handleQuickUpdate = () => {
    // Quick update functionality
  };

  const handleBackToTemplates = () => {
    setShowForm(false);
    setSelectedTemplate(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <EnhancedCampaignBuilderHeader />
          
          <EnhancedCampaignBuilderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showForm={showForm}
            selectedTemplate={selectedTemplate}
            formData={formData}
            isSubmitting={isSubmitting}
            onTemplateSelect={handleTemplateSelect}
            onCreateFromScratch={handleCreateFromScratch}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onBackToTemplates={handleBackToTemplates}
            onQuickUpdate={handleQuickUpdate}
          />
        </div>
      </div>

      <AutoCampaignPublisher
        campaign={createdCampaign}
        onPublished={handleCampaignPublished}
      />
    </>
  );
};

export default EnhancedCampaignBuilder;
