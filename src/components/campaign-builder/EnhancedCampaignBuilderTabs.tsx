
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BarChart3, Settings } from 'lucide-react';
import CampaignTemplates from './CampaignTemplates';
import CampaignManageTab from './CampaignManageTab';
import CampaignAnalytics from './CampaignAnalytics';
import EnhancedCampaignForm from './EnhancedCampaignForm';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
import { CampaignFormData } from '@/services/campaignService';

interface EnhancedCampaignBuilderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showForm: boolean;
  selectedTemplate: CampaignTemplate | null;
  formData: CampaignFormData;
  isSubmitting: boolean;
  onTemplateSelect: (template: CampaignTemplate) => void;
  onCreateFromScratch: () => void;
  onFormDataChange: (data: CampaignFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToTemplates: () => void;
  onQuickUpdate: () => void;
}

const EnhancedCampaignBuilderTabs = ({
  activeTab,
  setActiveTab,
  showForm,
  selectedTemplate,
  formData,
  isSubmitting,
  onTemplateSelect,
  onCreateFromScratch,
  onFormDataChange,
  onSubmit,
  onBackToTemplates,
  onQuickUpdate
}: EnhancedCampaignBuilderTabsProps) => {
  return (
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
          <EnhancedCampaignForm
            selectedTemplate={selectedTemplate}
            formData={formData}
            isSubmitting={isSubmitting}
            onFormDataChange={onFormDataChange}
            onSubmit={onSubmit}
            onBackToTemplates={onBackToTemplates}
          />
        ) : (
          <CampaignTemplates 
            onTemplateSelect={onTemplateSelect}
            onCreateFromScratch={onCreateFromScratch}
          />
        )}
      </TabsContent>

      <TabsContent value="manage">
        <CampaignManageTab onQuickUpdate={onQuickUpdate} />
      </TabsContent>

      <TabsContent value="analytics">
        <CampaignAnalytics />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedCampaignBuilderTabs;
