
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignTemplates from "./CampaignTemplates";
import CampaignAnalytics from "./CampaignAnalytics";
import CampaignManagementTools from "./CampaignManagementTools";
import CampaignCreateTab from "./CampaignCreateTab";
import CampaignManageTab from "./CampaignManageTab";
import { type CampaignTemplate } from "@/services/campaignTemplateService";

interface CampaignBuilderTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedTemplate: CampaignTemplate | null;
  showForm: boolean;
  campaigns: any[];
  onTemplateSelect: (template: CampaignTemplate) => void;
  onCreateFromScratch: () => void;
  onCampaignCreated: (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => void;
  onSuccess: () => void;
  onQuickUpdate: () => void;
  onCampaignsUpdate: () => void;
}

const CampaignBuilderTabs = ({
  activeTab,
  onTabChange,
  selectedTemplate,
  showForm,
  campaigns,
  onTemplateSelect,
  onCreateFromScratch,
  onCampaignCreated,
  onSuccess,
  onQuickUpdate,
  onCampaignsUpdate
}: CampaignBuilderTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="create">Create Campaign</TabsTrigger>
        <TabsTrigger value="manage">Manage Campaigns</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Tools</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="mt-6">
        <CampaignTemplates 
          onTemplateSelect={onTemplateSelect}
          onCreateFromScratch={onCreateFromScratch}
        />
      </TabsContent>

      <TabsContent value="create" className="mt-6">
        <CampaignCreateTab
          selectedTemplate={selectedTemplate}
          showForm={showForm}
          onCampaignCreated={onCampaignCreated}
          onSuccess={onSuccess}
          onBrowseTemplates={() => onTabChange("templates")}
        />
      </TabsContent>

      <TabsContent value="manage" className="mt-6">
        <CampaignManageTab onQuickUpdate={onQuickUpdate} />
      </TabsContent>

      <TabsContent value="advanced" className="mt-6">
        <CampaignManagementTools 
          campaigns={campaigns}
          onCampaignsUpdate={onCampaignsUpdate}
        />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <CampaignAnalytics />
      </TabsContent>
    </Tabs>
  );
};

export default CampaignBuilderTabs;
