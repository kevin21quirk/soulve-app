
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  Award,
  Filter
} from "lucide-react";
import { 
  getCampaignTemplates, 
  getPopularTemplates, 
  getHighPerformanceTemplates,
  type CampaignTemplate 
} from "@/services/campaignTemplateService";

interface CampaignTemplatesProps {
  onTemplateSelect: (template: CampaignTemplate) => void;
  onCreateFromScratch: () => void;
}

const CampaignTemplates = ({ onTemplateSelect, onCreateFromScratch }: CampaignTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("all");

  const allTemplates = getCampaignTemplates();
  const popularTemplates = getPopularTemplates();
  const highPerformanceTemplates = getHighPerformanceTemplates();

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesOrgType = selectedOrgType === "all" || template.organization_type === selectedOrgType;
    
    return matchesSearch && matchesCategory && matchesOrgType;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      fundraising: 'bg-green-100 text-green-800',
      volunteer: 'bg-blue-100 text-blue-800',
      awareness: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      petition: 'bg-red-100 text-red-800',
      social_cause: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getGoalTypeIcon = (goalType: string) => {
    switch (goalType) {
      case 'monetary': return <DollarSign className="h-4 w-4" />;
      case 'volunteers': return <Users className="h-4 w-4" />;
      case 'signatures': return <Target className="h-4 w-4" />;
      case 'participants': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const TemplateCard = ({ template }: { template: CampaignTemplate }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={template.featured_image}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getCategoryColor(template.category)}>
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              {getGoalTypeIcon(template.template_data.goal_type)}
              <span className="capitalize">{template.template_data.goal_type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{template.template_data.duration_days || 60} days</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span>{template.usage_count} uses</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Award className="h-4 w-4" />
              <span>{template.success_rate}% success</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {template.template_data.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.template_data.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.template_data.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={() => onTemplateSelect(template)}
            className="w-full"
          >
            Use This Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Campaign Template</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get started quickly with our proven campaign templates, or create your own from scratch
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onCreateFromScratch}
          variant="outline"
          className="border-2 border-dashed border-gray-300 text-gray-600 hover:border-soulve-blue hover:text-soulve-blue"
        >
          Start from Scratch
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
          <TabsTrigger value="high-performance">High Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="petition">Petition</SelectItem>
                <SelectItem value="social_cause">Social Cause</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedOrgType} onValueChange={setSelectedOrgType}>
              <SelectTrigger>
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="social_group">Social Group</SelectItem>
                <SelectItem value="community_group">Community Group</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredTemplates.length} templates</span>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedOrgType("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-semibold mb-2">Most Popular Templates</h3>
            <p className="text-gray-600">Templates used by thousands of successful campaigns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="high-performance" className="space-y-6">
          <div className="text-center">
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-semibold mb-2">High Performance Templates</h3>
            <p className="text-gray-600">Templates with the highest success rates and goal achievement</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highPerformanceTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignTemplates;
