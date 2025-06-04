
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-react';
import { CampaignFormData } from '@/services/campaignService';
import EnhancedMediaUpload from '../dashboard/post-creation/EnhancedMediaUpload';
import { MediaFile } from '../dashboard/media-upload/MediaUploadTypes';
import { useState } from 'react';

interface CampaignFormFieldsProps {
  formData: CampaignFormData;
  onFormDataChange: (data: CampaignFormData) => void;
}

const CampaignFormFields = ({ formData, onFormDataChange }: CampaignFormFieldsProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setSelectedMedia(files);
    // Convert media files to URLs for form data
    const mediaUrls = files.map(file => file.preview);
    handleInputChange('gallery_images', mediaUrls);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter campaign title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of your campaign"
          required
        />
      </div>

      <div>
        <Label htmlFor="story">Campaign Story</Label>
        <Textarea
          id="story"
          value={formData.story}
          onChange={(e) => handleInputChange('story', e.target.value)}
          placeholder="Tell your story in detail"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: CampaignFormData['category']) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundraising">Fundraising</SelectItem>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="awareness">Awareness</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="petition">Petition</SelectItem>
              <SelectItem value="social_cause">Social Cause</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="urgency">Urgency</Label>
          <Select value={formData.urgency} onValueChange={(value: CampaignFormData['urgency']) => handleInputChange('urgency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Campaign location"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal_amount">Goal Amount ($)</Label>
          <Input
            id="goal_amount"
            type="text"
            value={formData.goal_amount === 0 ? '' : formData.goal_amount.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                handleInputChange('goal_amount', value === '' ? 0 : Number(value));
              }
            }}
            placeholder="Enter amount (e.g. 5000)"
          />
        </div>

        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => handleInputChange('end_date', e.target.value)}
        />
      </div>

      {/* Media Upload Section */}
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable_comments">Enable Comments</Label>
          <Switch
            id="enable_comments"
            checked={formData.enable_comments}
            onCheckedChange={(checked) => handleInputChange('enable_comments', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enable_updates">Enable Updates</Label>
          <Switch
            id="enable_updates"
            checked={formData.enable_updates}
            onCheckedChange={(checked) => handleInputChange('enable_updates', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allow_anonymous_donations">Allow Anonymous Donations</Label>
          <Switch
            id="allow_anonymous_donations"
            checked={formData.allow_anonymous_donations}
            onCheckedChange={(checked) => handleInputChange('allow_anonymous_donations', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignFormFields;
