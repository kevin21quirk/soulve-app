
import { useState } from "react";
import CampaignBuilderHeader from "./CampaignBuilderHeader";
import CampaignBuilderTabs from "./CampaignBuilderTabs";
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
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
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
    handleCampaignsUpdate();
  };

  const handleCampaignsUpdate = () => {
    // This would normally fetch updated campaign data
    console.log("Refreshing campaigns data...");
  };

  const handleQuickUpdate = () => {
    handleCampaignUpdate(
      "Quick Campaign Update", 
      "Sharing an update about our campaign progress", 
      "community"
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <CampaignBuilderHeader />
      
      <CampaignBuilderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedTemplate={selectedTemplate}
        showForm={showForm}
        campaigns={campaigns}
        onTemplateSelect={handleTemplateSelect}
        onCreateFromScratch={handleCreateFromScratch}
        onCampaignCreated={handleCampaignUpdate}
        onSuccess={handleCampaignSuccess}
        onQuickUpdate={handleQuickUpdate}
        onCampaignsUpdate={handleCampaignsUpdate}
      />

      {/* Auto Campaign Publisher Component */}
      <AutoCampaignPublisher 
        campaign={pendingCampaign}
        onPublished={() => setPendingCampaign(undefined)}
      />
    </div>
  );
};

export default CampaignBuilder;
