
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Send, Video, Users, BarChart3, Calendar } from 'lucide-react';
import { PostFormData } from '@/components/dashboard/CreatePostTypes';

interface MobilePostActionBarProps {
  formData: PostFormData;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationDetect: () => void;
  onFeatureToggle: (feature: string) => void;
  onPost: () => void;
  disabled: boolean;
}

const MobilePostActionBar = ({
  formData,
  onImageSelect,
  onLocationDetect,
  onFeatureToggle,
  onPost,
  disabled
}: MobilePostActionBarProps) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 p-3">
      <div className="flex items-center space-x-1 overflow-x-auto">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button variant="ghost" size="sm" className="p-2" asChild>
            <span>
              <Camera className="h-4 w-4 text-green-500" />
            </span>
          </Button>
        </label>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-2 ${formData.isLiveVideo ? 'bg-red-50' : ''}`}
          onClick={() => onFeatureToggle('liveVideo')}
          title="Live Video"
        >
          <Video className="h-4 w-4 text-red-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-2 ${formData.hasGif ? 'bg-purple-50' : ''}`}
          onClick={() => onFeatureToggle('gif')}
          title="Add GIF"
        >
          <span className="text-xs font-bold text-purple-500">GIF</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => onFeatureToggle('tagUsers')}
          title="Tag People"
        >
          <Users className="h-4 w-4 text-blue-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={onLocationDetect}
          title="Add Location"
        >
          <MapPin className="h-4 w-4 text-red-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-2 ${formData.hasPoll ? 'bg-yellow-50' : ''}`}
          onClick={() => onFeatureToggle('poll')}
          title="Create Poll"
        >
          <BarChart3 className="h-4 w-4 text-yellow-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-2 ${formData.isEvent ? 'bg-blue-50' : ''}`}
          onClick={() => onFeatureToggle('event')}
          title="Create Event"
        >
          <Calendar className="h-4 w-4 text-blue-500" />
        </Button>
      </div>
      
      <Button 
        size="sm"
        onClick={onPost}
        disabled={disabled}
        className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        <Send className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default MobilePostActionBar;
