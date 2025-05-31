
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye, Users, MapPin } from "lucide-react";

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  allowTagging: boolean;
}

interface ProfilePrivacySettingsProps {
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
}

const ProfilePrivacySettings = ({ settings, onSettingsChange }: ProfilePrivacySettingsProps) => {
  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
        <CardDescription>
          Control who can see your information and how others can interact with you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Profile Visibility
          </Label>
          <Select 
            value={settings.profileVisibility} 
            onValueChange={(value: 'public' | 'friends' | 'private') => updateSetting('profileVisibility', value)}
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

        {/* Location Settings */}
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
            checked={settings.showLocation}
            onCheckedChange={(checked) => updateSetting('showLocation', checked)}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Contact Information</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show Email Address</Label>
              <p className="text-sm text-muted-foreground">
                Display your email on your profile
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked) => updateSetting('showEmail', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show Phone Number</Label>
              <p className="text-sm text-muted-foreground">
                Display your phone number on your profile
              </p>
            </div>
            <Switch
              checked={settings.showPhone}
              onCheckedChange={(checked) => updateSetting('showPhone', checked)}
            />
          </div>
        </div>

        {/* Interaction Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Interaction Settings</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Allow Direct Messages
              </Label>
              <p className="text-sm text-muted-foreground">
                Let others send you private messages
              </p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Display when you're active on the platform
              </p>
            </div>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Allow Tagging</Label>
              <p className="text-sm text-muted-foreground">
                Let others tag you in posts and comments
              </p>
            </div>
            <Switch
              checked={settings.allowTagging}
              onCheckedChange={(checked) => updateSetting('allowTagging', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePrivacySettings;
