
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Globe, Users, Lock } from "lucide-react";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";

interface VisibilityPermissionsProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const VisibilityPermissions = ({ formData, onFormDataChange }: VisibilityPermissionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Visibility</label>
        <Select value={formData.visibility} onValueChange={(value) => onFormDataChange('visibility', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Public</span>
              </div>
            </SelectItem>
            <SelectItem value="friends">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Friends</span>
              </div>
            </SelectItem>
            <SelectItem value="private">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Private</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.allowComments}
          onCheckedChange={(checked) => onFormDataChange('allowComments', checked)}
        />
        <label className="text-sm text-gray-700">Allow Comments</label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.allowSharing}
          onCheckedChange={(checked) => onFormDataChange('allowSharing', checked)}
        />
        <label className="text-sm text-gray-700">Allow Sharing</label>
      </div>
    </div>
  );
};

export default VisibilityPermissions;
