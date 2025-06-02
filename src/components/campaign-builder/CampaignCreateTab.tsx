
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles, ImageIcon, Video } from "lucide-react";
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
            <>Create compelling campaigns with rich media support. Add images, videos, and detailed stories to maximize reach and engagement.</>
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
        
        {/* Media Features Highlight */}
        {!showForm && (
          <div className="bg-gradient-to-r from-[#0ce4af]/10 to-[#18a5fe]/10 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#0ce4af]" />
              Rich Media Support
            </h4>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> High-quality images
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-3 w-3" /> Video storytelling
              </span>
              <span>Up to 8 files (15MB each)</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Select a template or start from scratch to begin creating your campaign with full media support.</p>
            <Button 
              onClick={onBrowseTemplates}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
            >
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
