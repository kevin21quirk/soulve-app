
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye, MapPin, Users, MessageSquare } from "lucide-react";

const MobilePrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profileVisibility: "friends",
    showLocation: true,
    showActivity: true,
    allowMessages: "everyone",
    showOnline: true,
    dataSharing: false,
    analyticsOptOut: false
  });

  const updatePrivacy = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Profile Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-medium mb-2 block">Profile Visibility</label>
            <Select 
              value={privacy.profileVisibility} 
              onValueChange={(value) => updatePrivacy("profileVisibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private - Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Show Location</span>
                <p className="text-sm text-gray-600">Allow others to see your general location</p>
              </div>
            </div>
            <Switch
              checked={privacy.showLocation}
              onCheckedChange={(checked) => updatePrivacy("showLocation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Show Activity Status</span>
                <p className="text-sm text-gray-600">Let others see when you're online</p>
              </div>
            </div>
            <Switch
              checked={privacy.showOnline}
              onCheckedChange={(checked) => updatePrivacy("showOnline", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Communication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-medium mb-2 block">Who can message you</label>
            <Select 
              value={privacy.allowMessages} 
              onValueChange={(value) => updatePrivacy("allowMessages", value)}
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
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Show Activity Feed</span>
                <p className="text-sm text-gray-600">Display your help activities to others</p>
              </div>
            </div>
            <Switch
              checked={privacy.showActivity}
              onCheckedChange={(checked) => updatePrivacy("showActivity", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data & Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Share Usage Data</span>
              <p className="text-sm text-gray-600">Help improve the app with anonymous usage data</p>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => updatePrivacy("dataSharing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Opt out of Analytics</span>
              <p className="text-sm text-gray-600">Disable all analytics tracking</p>
            </div>
            <Switch
              checked={privacy.analyticsOptOut}
              onCheckedChange={(checked) => updatePrivacy("analyticsOptOut", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePrivacySettings;
