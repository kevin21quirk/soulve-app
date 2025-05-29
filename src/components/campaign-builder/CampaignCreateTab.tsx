
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles } from "lucide-react";
import CampaignForm from "./CampaignForm";
import { type CampaignTemplate } from "@/services/campaignTemplateService";

interface CampaignCreateTabProps {
  selectedTemplate: CampaignTemplate | null;
  showForm: boolean;
  onCampaignCreated: (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => void;
  onSuccess: () => void;
  onBrowseTemplates: () => void;
}

const CampaignCreateTab = ({ 
  selectedTemplate, 
  showForm, 
  onCampaignCreated, 
  onSuccess, 
  onBrowseTemplates 
}: CampaignCreateTabProps) => {
  return (
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
            <Button onClick={onBrowseTemplates}>
              Browse Templates
            </Button>
          </div>
        ) : (
          <CampaignForm 
            onCampaignCreated={onCampaignCreated}
            onSuccess={onSuccess}
            selectedTemplate={selectedTemplate}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCreateTab;
