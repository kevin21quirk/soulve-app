
import { Button } from "@/components/ui/button";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";
import { FEELINGS } from "./PostOptionsConfig";

interface FeelingSelectorProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const FeelingSelector = ({ formData, onFormDataChange }: FeelingSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">How are you feeling?</label>
      <div className="flex flex-wrap gap-2">
        {FEELINGS.map((feeling) => (
          <Button
            key={feeling.value}
            variant={formData.feeling === feeling.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFormDataChange('feeling', feeling.value)}
            className="flex items-center space-x-1"
            type="button"
          >
            <span>{feeling.emoji}</span>
            <span className="text-xs">{feeling.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FeelingSelector;
