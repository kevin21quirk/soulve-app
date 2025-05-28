
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions = ({ isEditing, onEdit, onSave, onCancel }: ProfileActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <Button onClick={onSave} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onEdit} variant="outline" size="sm">
      <Edit className="h-4 w-4 mr-2" />
      Edit Profile
    </Button>
  );
};

export default ProfileActions;
