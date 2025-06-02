
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Shield, Eye, Users, MessageSquare, MapPin, Mail, Phone, Tag } from 'lucide-react';

const PrivacySettingsPanel = () => {
  const { privacySettings, updateSettings, isLoading } = usePrivacySettings();

  if (isLoading || !privacySettings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Profile Privacy
          </CardTitle>
          <CardDescription>
            Control who can see your profile and information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Profile Visibility
            </Label>
            <Select 
              value={privacySettings.profile_visibility} 
              onValueChange={(value) => handleSettingChange('profile_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                <SelectItem value="friends">Friends - Only connections can see your profile</SelectItem>
                <SelectItem value="private">Private - Only you can see your profile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Show Location
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your general location
              </p>
            </div>
            <Switch
              checked={privacySettings.show_location}
              onCheckedChange={(checked) => handleSettingChange('show_location', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Show Email Address
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your email on your profile
              </p>
            </div>
            <Switch
              checked={privacySettings.show_email}
              onCheckedChange={(checked) => handleSettingChange('show_email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Show Phone Number
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your phone number on your profile
              </p>
            </div>
            <Switch
              checked={privacySettings.show_phone}
              onCheckedChange={(checked) => handleSettingChange('show_phone', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication
          </CardTitle>
          <CardDescription>
            Control how others can interact with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Who can message you</Label>
            <Select 
              value={privacySettings.allow_direct_messages} 
              onValueChange={(value) => handleSettingChange('allow_direct_messages', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="verified">Verified Users Only</SelectItem>
                <SelectItem value="none">No One</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Display when you're active on the platform
              </p>
            </div>
            <Switch
              checked={privacySettings.show_online_status}
              onCheckedChange={(checked) => handleSettingChange('show_online_status', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Allow Tagging
              </Label>
              <p className="text-sm text-muted-foreground">
                Let others tag you in posts and comments
              </p>
            </div>
            <Switch
              checked={privacySettings.allow_tagging}
              onCheckedChange={(checked) => handleSettingChange('allow_tagging', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Show Activity Feed
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your help activities to others
              </p>
            </div>
            <Switch
              checked={privacySettings.show_activity_feed}
              onCheckedChange={(checked) => handleSettingChange('show_activity_feed', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettingsPanel;
