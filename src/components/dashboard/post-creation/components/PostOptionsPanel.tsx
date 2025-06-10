
import React from 'react';
import { PostFormData } from '../../CreatePostTypes';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface PostOptionsPanelProps {
  formData: PostFormData;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
}

const PostOptionsPanel = ({ formData, onUpdateFormData }: PostOptionsPanelProps) => {
  return (
    <div className="px-4">
      {formData.location && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{formData.location}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateFormData(prev => ({ ...prev, location: '' }))}
            className="h-auto p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostOptionsPanel;
