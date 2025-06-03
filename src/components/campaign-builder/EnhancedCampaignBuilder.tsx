
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, Target, BarChart3, Settings, HelpCircle, Shield } from "lucide-react";
import CampaignTemplates from "./CampaignTemplates";
import CampaignCreateTab from "./CampaignCreateTab";
import CampaignManageTab from "./CampaignManageTab";
import CampaignAnalytics from "./CampaignAnalytics";
import HelpApprovalTab from "../dashboard/tabs/HelpApprovalTab";
import HelpCenter from "../dashboard/HelpCenter";
import SafeSpaceTab from "../safe-space/SafeSpaceTab";
import { type CampaignTemplate } from "@/services/campaignTemplateService";
import { useToast } from "@/hooks/use-toast";
import { useHelpCompletion } from "@/hooks/useHelpCompletion";

const EnhancedCampaignBuilder = () => {
  const { toast } = useToast();
  const { pendingRequests } = useHelpCompletion();
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [campaigns] = useState([]);

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setShowForm(true);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Campaigns & Help Center
          </h1>
          <p className="text-gray-600 mt-2">Create powerful campaigns, get help, and access safe space support</p>
        </div>
        <Badge variant="soulve" className="px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Pro Builder
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger 
            value="create" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
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
          <TabsTrigger 
            value="safe-space" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Shield className="h-4 w-4" />
            <span>Safe Space</span>
          </TabsTrigger>
          <TabsTrigger 
            value="help-approvals" 
            className="relative flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Approvals</span>
            {pendingRequests.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="help-center" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          {!showForm ? (
            <CampaignTemplates 
              onTemplateSelect={handleTemplateSelect}
              onCreateFromScratch={handleCreateFromScratch}
            />
          ) : (
            <CampaignCreateTab
              selectedTemplate={selectedTemplate}
              showForm={showForm}
              onCampaignCreated={handleCampaignCreated}
              onSuccess={handleSuccess}
              onBrowseTemplates={() => setShowForm(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <CampaignManageTab onQuickUpdate={handleQuickUpdate} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CampaignAnalytics />
        </TabsContent>

        <TabsContent value="safe-space" className="mt-6">
          <SafeSpaceTab />
        </TabsContent>

        <TabsContent value="help-approvals" className="mt-6">
          <HelpApprovalTab />
        </TabsContent>

        <TabsContent value="help-center" className="mt-6">
          <HelpCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCampaignBuilder;
