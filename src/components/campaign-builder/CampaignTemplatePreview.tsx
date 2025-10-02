
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, Target, Users, Eye, CheckCircle } from "lucide-react";
import { CampaignTemplate } from "@/services/campaignTemplateService";

interface CampaignTemplatePreviewProps {
  template: CampaignTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

const CampaignTemplatePreview = ({ template, isOpen, onClose, onUse }: CampaignTemplatePreviewProps) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fundraising": return "💰";
      case "volunteer": return "🤝";
      case "awareness": return "📢";
      case "community": return "🏘️";
      case "petition": return "✊";
      case "social_cause": return "❤️";
      default: return "📋";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(template.category)}</span>
            <div>
              <h2 className="text-xl font-bold">{template.name}</h2>
              <p className="text-sm text-gray-600 capitalize">{template.category.replace('_', ' ')} Template</p>
            </div>
            {template.isPopular && (
              <Badge className="bg-orange-100 text-orange-800">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Template Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{template.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{template.template_data.duration_days || 60} days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Target Amount</p>
                    <p className="font-medium">£{(template.template_data.suggested_goal_amount || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Usage Count</p>
                    <p className="font-medium">{template.usage_count}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="font-medium">{template.success_rate}%</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.template_data.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Campaign Title</h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">{template.template_data.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">{template.template_data.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Campaign Story</h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">{template.template_data.story}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Proven Content Structure</h5>
                  <p className="text-sm text-gray-600">Pre-written content that has been tested and optimized for engagement.</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Strategic Guidance</h5>
                  <p className="text-sm text-gray-600">Built-in recommendations for campaign timing and promotion.</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Target Audience Insights</h5>
                  <p className="text-sm text-gray-600">Research-backed audience targeting recommendations.</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Success Metrics</h5>
                  <p className="text-sm text-gray-600">Clear KPIs and milestones to track your progress.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
              Use This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignTemplatePreview;
