
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Star, Clock, Target, Users, Filter } from "lucide-react";
import CampaignTemplateCard from "./CampaignTemplateCard";
import CampaignTemplatePreview from "./CampaignTemplatePreview";
import CustomCampaignBuilder from "./CustomCampaignBuilder";
import { campaignTemplates, getTemplatesByCategory, getPopularTemplates, searchTemplates } from "@/services/campaignTemplateService";

const EnhancedCampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { id: "all", label: "All Templates", icon: Target },
    { id: "education", label: "Education", icon: Users },
    { id: "healthcare", label: "Healthcare", icon: Plus },
    { id: "environment", label: "Environment", icon: Star },
    { id: "community", label: "Community", icon: Users },
    { id: "disaster-relief", label: "Disaster Relief", icon: Plus },
    { id: "animal-welfare", label: "Animal Welfare", icon: Star }
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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template) => {
    // This would navigate to the campaign form with pre-filled data
    console.log("Using template:", template);
    // For now, just switch to custom builder tab
    setActiveTab("custom");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Builder</h1>
          <p className="text-gray-600 mt-2">Create impactful campaigns using templates or build from scratch</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="soulve" className="px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            Enhanced Builder
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Popular</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
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
                  className="flex items-center space-x-1"
                >
                  <category.icon className="h-3 w-3" />
                  <span>{category.label}</span>
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
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPopularTemplates().map(template => (
              <CampaignTemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onUse={handleUseTemplate}
                showPopularBadge
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <CustomCampaignBuilder />
        </TabsContent>
      </Tabs>

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

export default EnhancedCampaignBuilder;
