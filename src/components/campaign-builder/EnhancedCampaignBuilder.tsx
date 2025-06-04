
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BarChart3, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createCampaign, CampaignFormData } from '@/services/campaignService';
import { useAuth } from '@/contexts/AuthContext';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
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
    // Pre-fill form with template data
    setFormData({
      ...formData,
      title: template.template_data.title,
      description: template.template_data.description,
      story: template.template_data.story,
      category: template.category,
      organization_type: template.organization_type,
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="templates" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Templates & Create</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Manage Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              {showForm && activeTab === "templates" ? (
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
