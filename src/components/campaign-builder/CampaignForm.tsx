
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Rocket, Save, Eye, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type CampaignTemplate } from "@/services/campaignTemplateService";
import EnhancedMediaUpload from "@/components/dashboard/post-creation/EnhancedMediaUpload";
import { MediaFile } from "@/components/dashboard/media-upload/MediaUploadTypes";

interface CampaignFormProps {
  onCampaignCreated: (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => void;
  onSuccess: () => void;
  selectedTemplate?: CampaignTemplate | null;
}

const CampaignForm = ({ onCampaignCreated, onSuccess, selectedTemplate }: CampaignFormProps) => {
  const { toast } = useToast();
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [formData, setFormData] = useState({
    title: selectedTemplate?.template_data.title || "",
    description: selectedTemplate?.template_data.description || "",
    story: selectedTemplate?.template_data.story || "",
    category: selectedTemplate?.category || "fundraising",
    goalAmount: selectedTemplate?.template_data.suggested_goal_amount || 5000,
    duration: selectedTemplate?.template_data.duration_days || 60,
    tags: selectedTemplate?.template_data.tags.join(", ") || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setSelectedMedia(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCampaignCreated(
        formData.title, 
        formData.description, 
        formData.category as 'fundraising' | 'volunteer' | 'awareness' | 'community'
      );
      
      toast({
        title: "Campaign Created Successfully!",
        description: selectedMedia.length > 0 
          ? `Your campaign has been created with ${selectedMedia.length} media files.`
          : "Your campaign has been created and will be shared in the community feed.",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error Creating Campaign",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {selectedTemplate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Using Template: {selectedTemplate.name}</h4>
          <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{selectedTemplate.category}</Badge>
            <Badge variant="outline">{selectedTemplate.success_rate}% Success Rate</Badge>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Campaign Type</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="goalAmount">Goal Amount (£)</Label>
            <Input
              id="goalAmount"
              type="number"
              value={formData.goalAmount}
              onChange={(e) => handleInputChange("goalAmount", parseInt(e.target.value))}
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
              placeholder="60"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="education, community, help"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of your campaign"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="story">Campaign Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange("story", e.target.value)}
              placeholder="Tell the full story of your campaign"
              rows={5}
              required
            />
          </div>
        </div>
      </div>

      {/* Enhanced Media Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5 text-[#0ce4af]" />
          <Label className="text-lg font-medium">Campaign Media</Label>
          <Badge variant="outline" className="text-xs">
            {selectedMedia.length} files selected
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Add images and videos to make your campaign more compelling. High-quality visuals help tell your story better.
        </p>
        <EnhancedMediaUpload
          onMediaChange={handleMediaChange}
          maxFiles={8}
          maxFileSize={15}
          acceptedTypes={['image/*', 'video/*']}
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-gray-600">
          {selectedTemplate ? "Customizing template" : "Creating from scratch"}
          {selectedMedia.length > 0 && (
            <span className="block text-[#0ce4af] font-medium">
              {selectedMedia.length} media file{selectedMedia.length !== 1 ? 's' : ''} attached
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          <Button type="button" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Create Campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CampaignForm;
