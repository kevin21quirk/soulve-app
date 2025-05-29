
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Target, Users, Eye } from "lucide-react";
import { CampaignTemplate } from "@/services/campaignTemplateService";

interface CampaignTemplateCardProps {
  template: CampaignTemplate;
  onSelect: (template: CampaignTemplate) => void;
  onUse: (template: CampaignTemplate) => void;
  showPopularBadge?: boolean;
}

const CampaignTemplateCard = ({ template, onSelect, onUse, showPopularBadge }: CampaignTemplateCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "education": return "🎓";
      case "healthcare": return "🏥";
      case "environment": return "🌱";
      case "community": return "🏘️";
      case "disaster-relief": return "🚨";
      case "animal-welfare": return "🐾";
      default: return "📋";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(template.category)}</span>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize">{template.category.replace('-', ' ')}</p>
            </div>
          </div>
          {showPopularBadge && template.isPopular && (
            <Badge className="bg-orange-100 text-orange-800">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{template.description}</p>

        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{template.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Target className="h-3 w-3" />
            <span>${template.targetAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="h-3 w-3" />
            <span>{template.usageCount} uses</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={getDifficultyColor(template.difficulty)}>
              {template.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(template)}
            className="flex-1 flex items-center space-x-1"
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="flex-1"
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTemplateCard;
