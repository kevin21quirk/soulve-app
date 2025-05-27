
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Lock } from "lucide-react";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";
import { FEELINGS, URGENCY_LEVELS } from "./PostOptionsConfig";

interface OptionsSummaryProps {
  formData: PostFormData;
}

const OptionsSummary = ({ formData }: OptionsSummaryProps) => {
  const getUrgencyConfig = () => 
    URGENCY_LEVELS.find(level => level.value === formData.urgency) || URGENCY_LEVELS[0];

  const getVisibilityIcon = () => {
    switch (formData.visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'friends': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (formData.urgency === 'low' && !formData.feeling && formData.tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
      {formData.urgency !== 'low' && (
        <Badge className={getUrgencyConfig().color}>
          {getUrgencyConfig().icon} {getUrgencyConfig().label}
        </Badge>
      )}
      {formData.feeling && (
        <Badge variant="outline">
          {FEELINGS.find(f => f.value === formData.feeling)?.emoji} Feeling {FEELINGS.find(f => f.value === formData.feeling)?.label}
        </Badge>
      )}
      <Badge variant="outline" className="flex items-center space-x-1">
        {getVisibilityIcon()}
        <span className="capitalize">{formData.visibility}</span>
      </Badge>
      {formData.tags.length > 0 && (
        <Badge variant="outline">
          {formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};

export default OptionsSummary;
