
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, Filter } from "lucide-react";
import CampaignTemplateCard from "./CampaignTemplateCard";
import CampaignTemplatePreview from "./CampaignTemplatePreview";
import { 
  campaignTemplates, 
  getTemplatesByCategory, 
  getPopularTemplates, 
  searchTemplates,
  type CampaignTemplate 
} from "@/services/campaignTemplateService";

interface CampaignTemplatesProps {
  onTemplateSelect: (template: CampaignTemplate) => void;
  onCreateFromScratch: () => void;
}

const CampaignTemplates = ({ onTemplateSelect, onCreateFromScratch }: CampaignTemplatesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "fundraising", label: "Fundraising" },
    { id: "volunteer", label: "Volunteer" },
    { id: "awareness", label: "Awareness" },
    { id: "community", label: "Community" },
    { id: "petition", label: "Petition" },
    { id: "social_cause", label: "Social Cause" }
  ];

  const getFilteredTemplates = () => {
    let filtered = campaignTemplates;

    if (searchQuery) {
      filtered = searchTemplates(searchQuery);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    return filtered;
  };

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template: CampaignTemplate) => {
    onTemplateSelect(template);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Templates</h2>
          <p className="text-gray-600 mt-1">Choose from proven templates or start from scratch</p>
        </div>
        <Button onClick={onCreateFromScratch} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create from Scratch</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredTemplates().map(template => (
          <CampaignTemplateCard
            key={template.id}
            template={template}
            onSelect={handleTemplateSelect}
            onUse={handleUseTemplate}
            showPopularBadge
          />
        ))}
      </div>

      {getFilteredTemplates().length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
        </Card>
      )}

      {showPreview && selectedTemplate && (
        <CampaignTemplatePreview
          template={selectedTemplate}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onUse={() => handleUseTemplate(selectedTemplate)}
        />
      )}
    </div>
  );
};

export default CampaignTemplates;
