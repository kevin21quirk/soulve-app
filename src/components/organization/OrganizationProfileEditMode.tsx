import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateOrganizationProfile, uploadOrganizationAvatar, uploadOrganizationBanner } from '@/services/organizationProfileService';
import { useToast } from '@/hooks/use-toast';

interface OrganizationProfileEditModeProps {
  organization: any;
  onSave: () => void;
  onCancel: () => void;
}

export const OrganizationProfileEditMode = ({ organization, onSave, onCancel }: OrganizationProfileEditModeProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name || '',
    description: organization.description || '',
    mission: organization.mission || '',
    vision: organization.vision || '',
    website: organization.website || '',
    contact_email: organization.contact_email || '',
    contact_phone: organization.contact_phone || '',
    location: organization.location || '',
    social_links: organization.social_links || {},
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateOrganizationProfile(organization.id, formData);
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Organization profile has been successfully updated.",
      });
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Could not update organization profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await uploadOrganizationAvatar(organization.id, file);
      if (avatarUrl) {
        toast({
          title: "Avatar Updated",
          description: "Organization avatar has been updated.",
        });
        onSave();
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const bannerUrl = await uploadOrganizationBanner(organization.id, file);
      if (bannerUrl) {
        toast({
          title: "Banner Updated",
          description: "Organization banner has been updated.",
        });
        onSave();
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload banner. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label>Banner Image</Label>
            <div className="relative h-48 bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] rounded-lg overflow-hidden">
              {organization.banner_url && (
                <img src={organization.banner_url} alt="Banner" className="w-full h-full object-cover" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 cursor-pointer transition-colors">
                <div className="text-white text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <span>Upload Banner</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label>Organization Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={organization.avatar_url} />
                <AvatarFallback className="text-3xl bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] text-white">
                  <Building className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter organization name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your organization"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="Your organization's mission"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="Your organization's vision"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.social_links.facebook || ''}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/yourorg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={formData.social_links.twitter || ''}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/yourorg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.social_links.linkedin || ''}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/company/yourorg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.social_links.instagram || ''}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/yourorg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
