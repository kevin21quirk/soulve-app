
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Send, Video, Users, BarChart3, Calendar } from 'lucide-react';
import { PostFormData } from '@/components/dashboard/CreatePostTypes';
import GifPicker from '@/components/dashboard/gif-picker/GifPicker';
import LiveVideoModal from '@/components/dashboard/live-video/LiveVideoModal';
import PollCreator from '@/components/dashboard/polls/PollCreator';
import EventCreator from '@/components/dashboard/events/EventCreator';

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
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showLiveVideo, setShowLiveVideo] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'liveVideo':
        setShowLiveVideo(true);
        break;
      case 'gif':
        setShowGifPicker(true);
        break;
      case 'poll':
        setShowPollCreator(true);
        break;
      case 'event':
        setShowEventCreator(true);
        break;
      default:
        onFeatureToggle(feature);
    }
  };

  const handleGifSelect = (gif: any) => {
    onFeatureToggle('gif');
    setShowGifPicker(false);
  };

  const handleLiveVideoStart = (streamData: any) => {
    onFeatureToggle('liveVideo');
    setShowLiveVideo(false);
  };

  const handlePollCreate = (pollData: any) => {
    onFeatureToggle('poll');
    setShowPollCreator(false);
  };

  const handleEventCreate = (eventData: any) => {
    onFeatureToggle('event');
    setShowEventCreator(false);
  };

  return (
    <>
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
            onClick={() => handleFeatureClick('liveVideo')}
            title="Live Video"
          >
            <Video className="h-4 w-4 text-red-500" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-2 ${formData.hasGif ? 'bg-purple-50' : ''}`}
            onClick={() => handleFeatureClick('gif')}
            title="Add GIF"
          >
            <span className="text-xs font-bold text-purple-500">GIF</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => handleFeatureClick('tagUsers')}
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
            onClick={() => handleFeatureClick('poll')}
            title="Create Poll"
          >
            <BarChart3 className="h-4 w-4 text-yellow-500" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-2 ${formData.isEvent ? 'bg-blue-50' : ''}`}
            onClick={() => handleFeatureClick('event')}
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

      {/* Modals */}
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

export default MobilePostActionBar;
