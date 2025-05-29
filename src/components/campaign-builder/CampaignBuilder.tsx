
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Users, 
  Target, 
  BarChart3, 
  Share2, 
  Settings,
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import CampaignAnalytics from "./CampaignAnalytics";
import CampaignSocialIntegration from "./CampaignSocialIntegration";
import CampaignTemplates from "./CampaignTemplates";
import AutoCampaignPublisher from "./AutoCampaignPublisher";
import { CampaignUpdate } from "@/services/feedIntegrationService";
import { useAutoFeedIntegration } from "@/hooks/useAutoFeedIntegration";
import { useToast } from "@/hooks/use-toast";
import { type CampaignTemplate } from "@/services/campaignTemplateService";

const CampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [pendingCampaign, setPendingCampaign] = useState<CampaignUpdate | undefined>();
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { publishCampaignToFeed } = useAutoFeedIntegration();
  const { toast } = useToast();

  // Mock function to simulate campaign creation/update
  const handleCampaignUpdate = (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => {
    const campaignUpdate: CampaignUpdate = {
      id: Date.now().toString(),
      title,
      description,
      campaignId: `campaign-${Date.now()}`,
      author: "You",
      type,
      location: "Your Area",
      tags: ['campaign', type]
    };

    // Auto-publish to feed
    publishCampaignToFeed(campaignUpdate);
    
    toast({
      title: "Campaign shared!",
      description: "Your campaign has been created and automatically shared with the community feed.",
    });
  };

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setShowForm(true);
    setActiveTab("create");
    
    toast({
      title: "Template selected!",
      description: `Using template: ${template.name}`,
    });
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setShowForm(true);
    setActiveTab("create");
  };

  const handleCampaignSuccess = () => {
    setSelectedTemplate(null);
    setShowForm(false);
    setActiveTab("manage");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Builder</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create impactful campaigns that automatically reach your community through our integrated feed system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="manage">Manage Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <CampaignTemplates 
            onTemplateSelect={handleTemplateSelect}
            onCreateFromScratch={handleCreateFromScratch}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-soulve-purple" />
                {selectedTemplate ? (
                  <>
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Create Campaign from Template: {selectedTemplate.name}
                  </>
                ) : (
                  "Create New Campaign"
                )}
              </CardTitle>
              <p className="text-gray-600">
                {selectedTemplate ? (
                  <>Your campaign will be pre-filled with proven content from the selected template. You can customize everything before publishing.</>
                ) : (
                  <>Your campaign will automatically be shared in the community feed to maximize reach and engagement.</>
                )}
              </p>
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
              {!showForm ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Select a template or start from scratch to begin creating your campaign.</p>
                  <Button onClick={() => setActiveTab("templates")}>
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <CampaignForm 
                  onCampaignCreated={handleCampaignUpdate}
                  onSuccess={handleCampaignSuccess}
                  selectedTemplate={selectedTemplate}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Campaigns</h2>
              <Button 
                onClick={() => handleCampaignUpdate(
                  "Quick Campaign Update", 
                  "Sharing an update about our campaign progress", 
                  "community"
                )}
                variant="outline"
                className="border-soulve-blue text-soulve-blue hover:bg-soulve-blue/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Update
              </Button>
            </div>
            <CampaignList />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CampaignAnalytics />
        </TabsContent>
      </Tabs>

      {/* Auto Campaign Publisher Component */}
      <AutoCampaignPublisher 
        campaign={pendingCampaign}
        onPublished={() => setPendingCampaign(undefined)}
      />
    </div>
  );
};

export default CampaignBuilder;
