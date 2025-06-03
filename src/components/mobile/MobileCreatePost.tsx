
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";
import { createUnifiedPost } from "@/services/unifiedPostService";
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
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handlePost = async () => {
    console.log('MobileCreatePost - Starting post creation');
    console.log('MobileCreatePost - Form data:', formData);

    if (!formData.description.trim()) {
      toast({
        title: "Missing content",
        description: "Please add some content to your post.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category for your post.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postId = await createUnifiedPost({
        title: formData.title || formData.description.split('\n')[0] || formData.description.substring(0, 50),
        content: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        location: formData.location,
        tags: formData.tags,
        visibility: formData.visibility
      });
      
      onPostCreated({ id: postId, success: true });
      
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

      toast({
        title: "Post shared! ✨",
        description: "Your post has been shared with the community.",
      });
      
    } catch (error) {
      console.error('MobileCreatePost - Error:', error);
      
      let errorMessage = "There was an error sharing your post. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('category')) {
          errorMessage = "Please select a valid category.";
        } else if (error.message.includes('content')) {
          errorMessage = "Please add content to your post.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Failed to share post",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={!formData.description.trim() || !formData.category || isSubmitting}
      />
    </div>
  );
};

export default MobileCreatePost;
