
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FEELINGS, POST_CATEGORIES } from '../../post-options/PostOptionsConfig';
import { PostFormData } from '../../CreatePostTypes';

interface SelectedOptionsDisplayProps {
  formData: PostFormData;
}

export const SelectedOptionsDisplay = ({ formData }: SelectedOptionsDisplayProps) => {
  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  if (!selectedFeeling && !selectedCategory && formData.urgency === 'low') {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-wrap gap-2">
        {selectedFeeling && (
          <Badge variant="secondary" className="text-xs">
            {selectedFeeling.emoji} {selectedFeeling.label}
          </Badge>
        )}
        {selectedCategory && (
          <Badge variant="outline" className="text-xs">
            {React.createElement(selectedCategory.icon, { className: "h-3 w-3 mr-1" })}
            {selectedCategory.label}
          </Badge>
        )}
        {formData.urgency !== 'low' && (
          <Badge variant="destructive" className="text-xs">
            {formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)} Priority
          </Badge>
        )}
      </div>
    </div>
  );
};
