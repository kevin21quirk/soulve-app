
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Calendar, Send, Video, Users, BarChart3 } from 'lucide-react';
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
  const handleFeatureToggle = (feature: string) => {
    switch (feature) {
      case 'liveVideo':
        onUpdateFormData(prev => ({ ...prev, isLiveVideo: !prev.isLiveVideo }));
        break;
      case 'gif':
        onUpdateFormData(prev => ({ ...prev, hasGif: !prev.hasGif }));
        break;
      case 'tagUsers':
        // This would open a user selector - for now just toggle
        console.log('Tag users feature clicked');
        break;
      case 'poll':
        onUpdateFormData(prev => ({ 
          ...prev, 
          hasPoll: !prev.hasPoll,
          pollOptions: prev.hasPoll ? [] : ['Option 1', 'Option 2']
        }));
        break;
      case 'event':
        onUpdateFormData(prev => ({ ...prev, isEvent: !prev.isEvent }));
        break;
    }
  };

  return (
    <div className="border-t border-gray-100 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:bg-green-50"
            title="Add Photo"
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${formData.isLiveVideo ? 'bg-red-50 text-red-600' : 'text-red-600 hover:bg-red-50'}`}
            onClick={() => handleFeatureToggle('liveVideo')}
            title="Live Video"
          >
            <Video className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${formData.hasGif ? 'bg-purple-50 text-purple-600' : 'text-purple-600 hover:bg-purple-50'}`}
            onClick={() => handleFeatureToggle('gif')}
            title="Add GIF"
          >
            <span className="text-xs font-bold">GIF</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => handleFeatureToggle('tagUsers')}
            title="Tag People"
          >
            <Users className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:bg-red-50"
            onClick={onLocationDetect}
            title="Add Location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${formData.hasPoll ? 'bg-yellow-50 text-yellow-600' : 'text-yellow-600 hover:bg-yellow-50'}`}
            onClick={() => handleFeatureToggle('poll')}
            title="Create Poll"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${formData.isEvent ? 'bg-blue-50 text-blue-600' : 'text-blue-600 hover:bg-blue-50'}`}
            onClick={() => handleFeatureToggle('event')}
            title="Create Event"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          
          <select
            value={formData.urgency}
            onChange={(e) => onUpdateFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
            className="text-xs border-0 bg-transparent text-gray-600 focus:outline-none ml-2"
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
