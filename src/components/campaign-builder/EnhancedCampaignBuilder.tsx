import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
import { CampaignFormData } from '@/services/campaignService';
import { useSubscription } from '@/hooks/useSubscription';
import AutoCampaignPublisher from './AutoCampaignPublisher';
import EnhancedCampaignBuilderHeader from './EnhancedCampaignBuilderHeader';
import EnhancedCampaignBuilderTabs from './EnhancedCampaignBuilderTabs';
import UpgradePrompt from '../subscription/UpgradePrompt';

const EnhancedCampaignBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription, loading: subscriptionLoading, planName, canCreateCampaign, getRemainingCampaigns } = useSubscription();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [currentCampaignCount, setCurrentCampaignCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    story: '',
    category: 'fundraising' as const,
    organization_type: 'individual' as const,
    goal_type: 'monetary' as const,
    goal_amount: 0,
    currency: 'GBP',
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

  // Fetch current campaign count on mount
  useEffect(() => {
    const fetchCampaignCount = async () => {
      if (!user) return;
      
      const { count, error } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)
        .neq('status', 'deleted');
      
      if (!error && count !== null) {
        setCurrentCampaignCount(count);
      }
    };

    fetchCampaignCount();
  }, [user]);

  const handleTemplateSelect = (template: CampaignTemplate) => {
    // Check if user can create more campaigns
    if (!canCreateCampaign(currentCampaignCount)) {
      setShowUpgradePrompt(true);
      toast({
        title: "Campaign limit reached",
        description: `You've reached your limit of ${currentCampaignCount} campaigns on the ${planName} plan.`,
        variant: "destructive"
      });
      return;
    }

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
    setShowUpgradePrompt(false);
    setActiveTab("templates");
  };

  const handleCreateFromScratch = () => {
    // Check if user can create more campaigns
    if (!canCreateCampaign(currentCampaignCount)) {
      setShowUpgradePrompt(true);
      toast({
        title: "Campaign limit reached",
        description: `You've reached your limit of ${currentCampaignCount} campaigns on the ${planName} plan.`,
        variant: "destructive"
      });
      return;
    }

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
      currency: 'GBP',
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
    setShowUpgradePrompt(false);
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
      // Upload gallery images to Supabase Storage if they are blob URLs
      let uploadedGalleryImages = formData.gallery_images;
      if (formData.gallery_images && formData.gallery_images.length > 0) {
        const imagesToUpload: File[] = [];
        
        // Check if images are blob URLs and need to be uploaded
        for (const imageUrl of formData.gallery_images) {
          if (typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              const file = new File([blob], `campaign-image-${Date.now()}.jpg`, { type: blob.type });
              imagesToUpload.push(file);
            } catch (err) {
              console.error('Failed to process blob URL:', err);
            }
          }
        }
        
        // Upload all blob images to storage
        if (imagesToUpload.length > 0) {
          const uploadPromises = imagesToUpload.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('campaign-images')
              .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
              .from('campaign-images')
              .getPublicUrl(filePath);
            
            return publicUrl;
          });
          
          uploadedGalleryImages = await Promise.all(uploadPromises);
        }
      }

      // Upload featured image if it's a blob URL
      let uploadedFeaturedImage = formData.featured_image;
      if (formData.featured_image && formData.featured_image.startsWith('blob:')) {
        try {
          const response = await fetch(formData.featured_image);
          const blob = await response.blob();
          const file = new File([blob], `featured-image-${Date.now()}.jpg`, { type: blob.type });
          
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('campaign-images')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('campaign-images')
            .getPublicUrl(filePath);
          
          uploadedFeaturedImage = publicUrl;
        } catch (err) {
          console.error('Failed to upload featured image:', err);
        }
      }

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
          featured_image: uploadedFeaturedImage,
          gallery_images: uploadedGalleryImages,
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

      // Update campaign count
      setCurrentCampaignCount(prev => prev + 1);

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
        currency: 'GBP',
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
          
          {showUpgradePrompt ? (
            <div className="mt-6">
              <UpgradePrompt
                title="Upgrade to Create More Campaigns"
                description="You've reached your campaign limit on the current plan."
                feature="campaigns"
                currentLimit={currentCampaignCount}
                planName={planName}
              />
            </div>
          ) : (
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
          )}

          {!showUpgradePrompt && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {subscriptionLoading ? (
                "Loading subscription..."
              ) : (
                <>
                  <strong>{getRemainingCampaigns(currentCampaignCount)}</strong> of{" "}
                  <strong>{subscription ? subscription.plan.max_campaigns : 3}</strong> campaigns remaining
                  {" on "}<strong>{planName}</strong> plan
                </>
              )}
            </div>
          )}
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
