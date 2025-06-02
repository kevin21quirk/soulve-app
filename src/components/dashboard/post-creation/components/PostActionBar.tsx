
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Calendar, Send } from 'lucide-react';
import { URGENCY_LEVELS } from '../../post-options/PostOptionsConfig';
import { PostFormData } from '../../CreatePostTypes';

interface PostActionBarProps {
  formData: PostFormData;
  onLocationDetect: () => void;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
  disabled: boolean;
}

export const PostActionBar = ({ 
  formData, 
  onLocationDetect, 
  onUpdateFormData, 
  disabled 
}: PostActionBarProps) => {
  return (
    <div className="border-t border-gray-100 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
            <Camera className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:bg-red-50"
            onClick={onLocationDetect}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
            <Calendar className="h-4 w-4" />
          </Button>
          
          <select
            value={formData.urgency}
            onChange={(e) => onUpdateFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
            className="text-xs border-0 bg-transparent text-gray-600 focus:outline-none"
          >
            {URGENCY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        
        <Button 
          type="submit"
          disabled={disabled}
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-6 py-2 text-sm font-medium disabled:opacity-50 hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90"
        >
          <Send className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};
