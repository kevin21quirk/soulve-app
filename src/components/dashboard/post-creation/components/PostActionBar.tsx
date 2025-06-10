
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Calendar, Send, Video, Users, BarChart3 } from 'lucide-react';
import { URGENCY_LEVELS } from '../../post-options/PostOptionsConfig';
import { PostFormData, MediaFile } from '../../CreatePostTypes';
import LocationSelector from '../LocationSelector';
import GifPicker from '../../gif-picker/GifPicker';
import LiveVideoModal from '../../live-video/LiveVideoModal';
import UserTagging from '../../tagging/UserTagging';
import PollCreator from '../../polls/PollCreator';
import EventCreator from '../../events/EventCreator';

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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showLiveVideo, setShowLiveVideo] = useState(false);
  const [showUserTagging, setShowUserTagging] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const mediaFiles: MediaFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      size: file.size
    }));

    onUpdateFormData(prev => ({
      ...prev,
      selectedMedia: [...(prev.selectedMedia || []), ...mediaFiles]
    }));

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFeatureToggle = (feature: string) => {
    switch (feature) {
      case 'liveVideo':
        setShowLiveVideo(true);
        break;
      case 'gif':
        setShowGifPicker(true);
        break;
      case 'tagUsers':
        setShowUserTagging(true);
        break;
      case 'poll':
        setShowPollCreator(true);
        break;
      case 'event':
        setShowEventCreator(true);
        break;
      case 'location':
        setShowLocationPicker(true);
        break;
    }
  };

  const handleLocationSelect = (location: any) => {
    onUpdateFormData(prev => ({ ...prev, location: location.address }));
    setShowLocationPicker(false);
  };

  const handleGifSelect = (gif: any) => {
    onUpdateFormData(prev => ({ ...prev, hasGif: true, selectedGif: gif }));
    setShowGifPicker(false);
  };

  const handleLiveVideoStart = (streamData: any) => {
    onUpdateFormData(prev => ({ ...prev, isLiveVideo: true, liveVideoData: streamData }));
    setShowLiveVideo(false);
  };

  const handlePollCreate = (pollData: any) => {
    onUpdateFormData(prev => ({ 
      ...prev, 
      hasPoll: true, 
      pollOptions: pollData.options.map((opt: any) => opt.text),
      pollData 
    }));
    setShowPollCreator(false);
  };

  const handleEventCreate = (eventData: any) => {
    onUpdateFormData(prev => ({ ...prev, isEvent: true, eventData }));
    setShowEventCreator(false);
  };

  return (
    <>
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className="text-green-600 hover:bg-green-50"
              onClick={handleCameraClick}
              title="Add Photo"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className={`${formData.isLiveVideo ? 'bg-red-50 text-red-600' : 'text-red-600 hover:bg-red-50'}`}
              onClick={() => handleFeatureToggle('liveVideo')}
              title="Live Video"
            >
              <Video className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className={`${formData.hasGif ? 'bg-purple-50 text-purple-600' : 'text-purple-600 hover:bg-purple-50'}`}
              onClick={() => handleFeatureToggle('gif')}
              title="Add GIF"
            >
              <span className="text-xs font-bold">GIF</span>
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => handleFeatureToggle('tagUsers')}
              title="Tag People"
            >
              <Users className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => handleFeatureToggle('location')}
              title="Add Location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              className={`${formData.hasPoll ? 'bg-yellow-50 text-yellow-600' : 'text-yellow-600 hover:bg-yellow-50'}`}
              onClick={() => handleFeatureToggle('poll')}
              title="Create Poll"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
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

      {/* Modals and Pickers */}
      {showLocationPicker && (
        <div className="absolute z-50 mt-2">
          <LocationSelector
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.location}
          />
        </div>
      )}

      {showGifPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GifPicker
            onGifSelect={handleGifSelect}
            onClose={() => setShowGifPicker(false)}
          />
        </div>
      )}

      {showLiveVideo && (
        <LiveVideoModal
          onStartLive={handleLiveVideoStart}
          onClose={() => setShowLiveVideo(false)}
        />
      )}

      {showPollCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PollCreator
            onPollCreate={handlePollCreate}
            onClose={() => setShowPollCreator(false)}
          />
        </div>
      )}

      {showEventCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventCreator
            onEventCreate={handleEventCreate}
            onClose={() => setShowEventCreator(false)}
          />
        </div>
      )}
    </>
  );
};
