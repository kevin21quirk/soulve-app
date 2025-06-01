
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PostFormData } from "../CreatePostTypes";

interface VisibilityPermissionsProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const VisibilityPermissions = ({ formData, onFormDataChange }: VisibilityPermissionsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Visibility</label>
        <Select value={formData.visibility} onValueChange={(value) => onFormDataChange('visibility', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">🌍 Public - Everyone can see</SelectItem>
            <SelectItem value="friends">👥 Friends - Only connections</SelectItem>
            <SelectItem value="private">🔒 Private - Only you</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="allow-comments" className="text-sm font-medium">
          Allow comments
        </Label>
        <Switch
          id="allow-comments"
          checked={formData.allowComments}
          onCheckedChange={(checked) => onFormDataChange('allowComments', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="allow-sharing" className="text-sm font-medium">
          Allow sharing
        </Label>
        <Switch
          id="allow-sharing"
          checked={formData.allowSharing}
          onCheckedChange={(checked) => onFormDataChange('allowSharing', checked)}
        />
      </div>
    </div>
  );
};

export default VisibilityPermissions;
