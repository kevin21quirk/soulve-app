import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  updateOrganizationProfile,
  uploadOrganizationAvatar,
  uploadOrganizationBanner,
  OrganizationProfileUpdate,
} from '@/services/organizationProfileService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Image as ImageIcon, Save, X } from 'lucide-react';

interface OrganizationProfileEditorProps {
  organization: any;
  onUpdate: () => void;
}

export const OrganizationProfileEditor = ({
  organization,
  onUpdate,
}: OrganizationProfileEditorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrganizationProfileUpdate>({
    name: organization.name || '',
    organization_type: organization.organization_type || '',
    description: organization.description || '',
    mission: organization.mission || '',
    vision: organization.vision || '',
    website: organization.website || '',
    location: organization.location || '',
    contact_email: organization.contact_email || '',
    contact_phone: organization.contact_phone || '',
    established_year: organization.established_year || undefined,
    registration_number: organization.registration_number || '',
    social_links: organization.social_links || {},
    tags: organization.tags || [],
    avatar_url: organization.avatar_url || '',
    banner_url: organization.banner_url || '',
  });

  const handleInputChange = (field: keyof OrganizationProfileUpdate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Avatar must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const avatarUrl = await uploadOrganizationAvatar(organization.id, file);
    
    if (avatarUrl) {
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
      
      // Save to database immediately
      await updateOrganizationProfile(organization.id, { avatar_url: avatarUrl });
      onUpdate();
      
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Banner must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const bannerUrl = await uploadOrganizationBanner(organization.id, file);
    
    if (bannerUrl) {
      setFormData((prev) => ({ ...prev, banner_url: bannerUrl }));
      
      // Save to database immediately
      await updateOrganizationProfile(organization.id, { banner_url: bannerUrl });
      onUpdate();
      
      toast({
        title: 'Success',
        description: 'Banner uploaded successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to upload banner',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await updateOrganizationProfile(organization.id, formData);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update organization profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Organization profile updated successfully',
      });
      onUpdate();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Banner Section */}
      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
          {formData.banner_url ? (
            <img
              src={formData.banner_url}
              alt="Organization banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            <Button size="sm" variant="secondary" className="pointer-events-none">
              <Camera className="h-4 w-4 mr-2" />
              Upload Banner
            </Button>
          </label>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback>{formData.name?.[0] || 'O'}</AvatarFallback>
          </Avatar>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button size="sm" variant="outline" className="pointer-events-none">
              <Camera className="h-4 w-4 mr-2" />
              Upload Avatar
            </Button>
          </label>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="space-y-2">
          <Label>Organization Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Organization name"
          />
        </div>

        <div className="space-y-2">
          <Label>Organization Type</Label>
          <Select
            value={formData.organization_type}
            onValueChange={(value) => handleInputChange('organization_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="community-group">Community Group</SelectItem>
              <SelectItem value="religious-group">Religious Group</SelectItem>
              <SelectItem value="social-group">Social Group</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <Label>Established Year</Label>
          <Input
            type="number"
            value={formData.established_year || ''}
            onChange={(e) => handleInputChange('established_year', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="YYYY"
          />
        </div>

        <div className="space-y-2">
          <Label>Registration Number</Label>
          <Input
            value={formData.registration_number}
            onChange={(e) => handleInputChange('registration_number', e.target.value)}
            placeholder="Official registration number"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">About</h3>
        
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your organization"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Mission</Label>
          <Textarea
            value={formData.mission}
            onChange={(e) => handleInputChange('mission', e.target.value)}
            placeholder="Your organization's mission"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Vision</Label>
          <Textarea
            value={formData.vision}
            onChange={(e) => handleInputChange('vision', e.target.value)}
            placeholder="Your organization's vision"
            rows={3}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
            placeholder="contact@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media</h3>
        
        <div className="space-y-2">
          <Label>Facebook</Label>
          <Input
            value={formData.social_links?.facebook || ''}
            onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div className="space-y-2">
          <Label>Twitter</Label>
          <Input
            value={formData.social_links?.twitter || ''}
            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

        <div className="space-y-2">
          <Label>Instagram</Label>
          <Input
            value={formData.social_links?.instagram || ''}
            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        <div className="space-y-2">
          <Label>LinkedIn</Label>
          <Input
            value={formData.social_links?.linkedin || ''}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
