
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CampaignFormData } from "@/services/campaignService";

interface SettingsTabProps {
  setValue: UseFormSetValue<CampaignFormData>;
}

const SettingsTab = ({ setValue }: SettingsTabProps) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="visibility">Campaign Visibility</Label>
          <Select onValueChange={(value: any) => setValue('visibility', value)} defaultValue="public">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can see and join</SelectItem>
              <SelectItem value="private">Private - Only you can see</SelectItem>
              <SelectItem value="invite_only">Invite Only - Only invited people can see</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Anonymous Donations</Label>
              <p className="text-sm text-gray-600">Let people contribute without revealing their identity</p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(checked) => setValue('allow_anonymous_donations', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Comments</Label>
              <p className="text-sm text-gray-600">Allow supporters to leave comments and messages</p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(checked) => setValue('enable_comments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Updates</Label>
              <p className="text-sm text-gray-600">Allow posting progress updates to supporters</p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(checked) => setValue('enable_updates', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
