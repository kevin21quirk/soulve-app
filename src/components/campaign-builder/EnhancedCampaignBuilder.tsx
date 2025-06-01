
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, Target, BarChart3, Settings } from "lucide-react";
import CampaignTemplates from "./CampaignTemplates";
import CampaignCreateTab from "./CampaignCreateTab";
import CampaignManageTab from "./CampaignManageTab";
import CampaignAnalytics from "./CampaignAnalytics";
import { type CampaignTemplate } from "@/services/campaignTemplateService";
import { useToast } from "@/hooks/use-toast";

const EnhancedCampaignBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [campaigns] = useState([]);

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setShowForm(true);
    setActiveTab("create");
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setShowForm(true);
    setActiveTab("create");
  };

  const handleCampaignCreated = (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => {
    console.log("Campaign created:", { title, description, type });
    toast({
      title: "Campaign Created!",
      description: "Your campaign has been successfully created and shared.",
    });
  };

  const handleSuccess = () => {
    setActiveTab("manage");
    setShowForm(false);
    setSelectedTemplate(null);
  };

  const handleQuickUpdate = () => {
    console.log("Quick update functionality triggered");
  };

  const handleCampaignsUpdate = () => {
    console.log("Campaigns updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Enhanced Campaign Builder
          </h1>
          <p className="text-gray-600 mt-2">Create powerful campaigns with our advanced tools and templates</p>
        </div>
        <Badge variant="soulve" className="px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Pro Builder
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="templates" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Target className="h-4 w-4" />
            <span>Create</span>
          </TabsTrigger>
          <TabsTrigger 
            value="manage" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            <span>Manage</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <CampaignTemplates 
            onTemplateSelect={handleTemplateSelect}
            onCreateFromScratch={handleCreateFromScratch}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <CampaignCreateTab
            selectedTemplate={selectedTemplate}
            showForm={showForm}
            onCampaignCreated={handleCampaignCreated}
            onSuccess={handleSuccess}
            onBrowseTemplates={() => setActiveTab("templates")}
          />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <CampaignManageTab onQuickUpdate={handleQuickUpdate} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CampaignAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCampaignBuilder;
