
import { Badge } from "@/components/ui/badge";
import { PostFormData } from "../CreatePostTypes";

interface OptionsSummaryProps {
  formData: PostFormData;
}

const OptionsSummary = ({ formData }: OptionsSummaryProps) => {
  if (!formData.category && !formData.urgency && formData.tags.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Post Summary</h4>
      <div className="space-y-2">
        {formData.category && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Category:</span>
            <Badge variant="outline">{formData.category}</Badge>
          </div>
        )}
        
        {formData.urgency && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Urgency:</span>
            <Badge variant="outline">{formData.urgency}</Badge>
          </div>
        )}
        
        {formData.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Visibility:</span>
          <Badge variant="outline">{formData.visibility}</Badge>
        </div>
      </div>
    </div>
  );
};

export default OptionsSummary;
