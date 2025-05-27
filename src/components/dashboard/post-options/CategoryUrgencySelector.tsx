
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";
import { POST_CATEGORIES, URGENCY_LEVELS } from "./PostOptionsConfig";

interface CategoryUrgencySelectorProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const CategoryUrgencySelector = ({ formData, onFormDataChange }: CategoryUrgencySelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Category *</label>
        <Select value={formData.category} onValueChange={(value) => onFormDataChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {POST_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency Level</label>
        <Select value={formData.urgency} onValueChange={(value) => onFormDataChange('urgency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            {URGENCY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                <div className="flex items-center space-x-2">
                  <span>{level.icon}</span>
                  <span>{level.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategoryUrgencySelector;
