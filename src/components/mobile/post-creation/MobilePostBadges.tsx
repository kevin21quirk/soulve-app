
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Video, BarChart3, Calendar } from 'lucide-react';
import { FEELINGS, POST_CATEGORIES } from '@/components/dashboard/post-options/PostOptionsConfig';
import { PostFormData } from '@/components/dashboard/CreatePostTypes';

interface MobilePostBadgesProps {
  formData: PostFormData;
}

const MobilePostBadges = ({ formData }: MobilePostBadgesProps) => {
  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  return (
    <div className="flex flex-wrap gap-2 mb-3 px-4">
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
      {formData.isLiveVideo && (
        <Badge variant="destructive" className="text-xs">
          <Video className="h-3 w-3 mr-1" />
          Live Video
        </Badge>
      )}
      {formData.hasGif && (
        <Badge variant="secondary" className="text-xs">
          GIF Added
        </Badge>
      )}
      {formData.hasPoll && (
        <Badge variant="outline" className="text-xs">
          <BarChart3 className="h-3 w-3 mr-1" />
          Poll
        </Badge>
      )}
      {formData.isEvent && (
        <Badge variant="outline" className="text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          Event
        </Badge>
      )}
    </div>
  );
};

export default MobilePostBadges;
