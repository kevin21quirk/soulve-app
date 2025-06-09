
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus } from 'lucide-react';
import { type CampaignTemplate } from '@/services/campaignTemplateService';
import { CampaignFormData } from '@/services/campaignService';
import CampaignFormFields from './CampaignFormFields';

interface EnhancedCampaignFormProps {
  selectedTemplate: CampaignTemplate | null;
  formData: CampaignFormData;
  isSubmitting: boolean;
  onFormDataChange: (data: CampaignFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToTemplates: () => void;
}

const EnhancedCampaignForm = ({
  selectedTemplate,
  formData,
  isSubmitting,
  onFormDataChange,
  onSubmit,
  onBackToTemplates
}: EnhancedCampaignFormProps) => {
  return (
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
            onClick={onBackToTemplates}
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
        <form onSubmit={onSubmit} className="space-y-6">
          <CampaignFormFields
            formData={formData}
            onFormDataChange={onFormDataChange}
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
  );
};

export default EnhancedCampaignForm;
