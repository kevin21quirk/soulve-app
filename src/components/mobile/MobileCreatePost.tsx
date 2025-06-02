
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";
import MobilePostHeader from "./post-creation/MobilePostHeader";
import MobilePostContent from "./post-creation/MobilePostContent";
import MobilePostOptions from "./post-creation/MobilePostOptions";
import MobilePostBadges from "./post-creation/MobilePostBadges";
import MobilePostActionBar from "./post-creation/MobilePostActionBar";
import MobilePostCollapsed from "./post-creation/MobilePostCollapsed";

interface MobileCreatePostProps {
  onPostCreated: (post: any) => void;
}

const MobileCreatePost = ({ onPostCreated }: MobileCreatePostProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    urgency: 'low',
    feeling: '',
    tags: [],
    visibility: 'public',
    allowComments: true,
    allowSharing: true,
    // New features
    isLiveVideo: false,
    hasGif: false,
    taggedUsers: [],
    hasPoll: false,
    pollOptions: [],
    isEvent: false,
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 4));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setFormData(prev => ({ ...prev, location: 'Current Location' })),
        () => setFormData(prev => ({ ...prev, location: 'Location unavailable' }))
      );
    }
  };

  const handleFeatureToggle = (feature: string) => {
    switch (feature) {
      case 'liveVideo':
        setFormData(prev => ({ ...prev, isLiveVideo: !prev.isLiveVideo }));
        break;
      case 'gif':
        setFormData(prev => ({ ...prev, hasGif: !prev.hasGif }));
        break;
      case 'poll':
        setFormData(prev => ({ 
          ...prev, 
          hasPoll: !prev.hasPoll,
          pollOptions: prev.hasPoll ? [] : ['Option 1', 'Option 2']
        }));
        break;
      case 'event':
        setFormData(prev => ({ ...prev, isEvent: !prev.isEvent }));
        break;
      case 'tagUsers':
        console.log('Tag users feature clicked');
        break;
    }
  };

  const handlePost = () => {
    if (!formData.description.trim() || !formData.category) return;

    const postData = {
      ...formData,
      title: formData.title || formData.description.split('\n')[0] || formData.description.substring(0, 50)
    };

    onPostCreated(postData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      urgency: 'low',
      feeling: '',
      tags: [],
      visibility: 'public',
      allowComments: true,
      allowSharing: true,
      isLiveVideo: false,
      hasGif: false,
      taggedUsers: [],
      hasPoll: false,
      pollOptions: [],
      isEvent: false,
    });
    setSelectedImages([]);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return <MobilePostCollapsed user={user} onExpand={() => setIsExpanded(true)} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <MobilePostHeader 
        user={user} 
        onCancel={() => setIsExpanded(false)} 
      />

      <div className="p-4">
        <MobilePostOptions
          formData={formData}
          showFeelings={showFeelings}
          showCategories={showCategories}
          onToggleFeelings={() => setShowFeelings(!showFeelings)}
          onToggleCategories={() => setShowCategories(!showCategories)}
          onUpdateFormData={setFormData}
        />
      </div>

      <MobilePostContent
        formData={formData}
        user={user}
        selectedImages={selectedImages}
        onUpdateFormData={setFormData}
        onRemoveImage={removeImage}
      />

      <MobilePostBadges formData={formData} />

      <MobilePostActionBar
        formData={formData}
        onImageSelect={handleImageSelect}
        onLocationDetect={detectLocation}
        onFeatureToggle={handleFeatureToggle}
        onPost={handlePost}
        disabled={!formData.description.trim() || !formData.category}
      />
    </div>
  );
};

export default MobileCreatePost;
