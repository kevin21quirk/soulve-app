import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BarChart3, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
import { CampaignFormData } from '@/services/campaignService';
import AutoCampaignPublisher from './AutoCampaignPublisher';
import CampaignFormFields from './CampaignFormFields';
import CampaignTemplates from './CampaignTemplates';
import CampaignManageTab from './CampaignManageTab';
import CampaignAnalytics from './CampaignAnalytics';

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
    setActiveTab("create");
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
    setActiveTab("create");
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
      console.log('Creating campaign with enhanced data:', formData);

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

      if (error) {
        console.error('Error creating campaign:', error);
        throw error;
      }

      console.log('Campaign created successfully with status:', campaign.status);
      
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

  const handleQuickUpdate = () => {
    console.log("Quick update functionality triggered");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Campaign Center
              </h1>
              <p className="text-gray-600 mt-2">Create, manage, and analyze your fundraising campaigns</p>
            </div>
            <Badge variant="soulve" className="px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Enhanced Builder
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100">
              <TabsTrigger 
                value="templates" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
              >
                <Sparkles className="h-4 w-4" />
                <span>Templates & Create</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Manage Campaigns</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              {showForm ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        {selectedTemplate ? (
                          <>Create Campaign from Template: {selectedTemplate.name}</>
                        ) : (
                          "Create New Campaign"
                        )}
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          setSelectedTemplate(null);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4 rotate-45" />
                        Back to Templates
                      </Button>
                    </div>
                    {selectedTemplate && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          {selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {selectedTemplate.success_rate}% Success Rate
                        </Badge>
                        <Badge variant="outline">
                          {selectedTemplate.usage_count} Uses
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <CampaignFormFields
                        formData={formData}
                        onFormDataChange={handleFormDataChange}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !formData.title || !formData.description}
                          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                        >
                          {isSubmitting ? 'Creating & Publishing...' : 'Create & Publish Campaign'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <CampaignTemplates 
                  onTemplateSelect={handleTemplateSelect}
                  onCreateFromScratch={handleCreateFromScratch}
                />
              )}
            </TabsContent>

            <TabsContent value="manage">
              <CampaignManageTab onQuickUpdate={handleQuickUpdate} />
            </TabsContent>

            <TabsContent value="analytics">
              <CampaignAnalytics />
            </TabsContent>
          </Tabs>
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
