
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PostFormData } from '../CreatePostTypes';
import PostFormHeader from './components/PostFormHeader';
import PostContentArea from './components/PostContentArea';
import PostCategorySelector from './components/PostCategorySelector';
import PostOptionsPanel from './components/PostOptionsPanel';
import { PostActionBar } from './components/PostActionBar';
import MediaPreview from './MediaPreview';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
  isSubmitting: boolean;
  sharedPost?: any;
  editMode?: boolean;
  postId?: string;
  initialData?: Partial<PostFormData>;
}

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting,
  sharedPost,
  editMode = false,
  postId,
  initialData
}: CreatePostModalProps) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    urgency: 'medium',
    feeling: '',
    tags: [],
    visibility: 'public',
    allowComments: true,
    allowSharing: true,
    selectedMedia: [],
    isLiveVideo: false,
    hasGif: false,
    taggedUsers: [],
    hasPoll: false,
    pollOptions: [],
    isEvent: false,
  });

  useEffect(() => {
    if (editMode && initialData) {
      console.log('CreatePostModal - Setting up edit mode with data:', initialData);
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    } else if (sharedPost) {
      console.log('CreatePostModal - Setting up shared post data:', sharedPost);
      setFormData(prev => ({
        ...prev,
        description: `Sharing: ${sharedPost.title}\n\n${sharedPost.description}`,
        category: sharedPost.category || '',
        tags: sharedPost.tags || []
      }));
    }
  }, [sharedPost, editMode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CreatePostModal - Submitting form data:', formData);
    const submitData = editMode && postId ? { ...formData, postId } : formData;
    onSubmit(submitData);
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ 
            ...prev, 
            location: `${position.coords.latitude}, ${position.coords.longitude}` 
          }));
        },
        () => {
          setFormData(prev => ({ ...prev, location: 'Location unavailable' }));
        }
      );
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMedia: prev.selectedMedia?.filter(media => media.id !== mediaId) || []
    }));
  };

  const isFormValid = formData.description.trim() && formData.category;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>
            {editMode ? 'Edit Post' : sharedPost ? 'Share Post' : 'Create New Post'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 px-6 pb-4">
            <PostFormHeader />
            
            <PostContentArea
              formData={formData}
              onUpdateFormData={setFormData}
            />
            
            <PostCategorySelector
              selectedCategory={formData.category}
              onCategorySelect={(category) => 
                setFormData(prev => ({ ...prev, category }))
              }
            />
            
            <PostOptionsPanel
              formData={formData}
              onUpdateFormData={setFormData}
            />
          </div>

          <div className="flex-shrink-0 px-6">
            <MediaPreview
              mediaFiles={formData.selectedMedia || []}
              onRemoveFile={handleRemoveMedia}
            />
          </div>

          <div className="flex-shrink-0">
            <PostActionBar
              formData={formData}
              onLocationDetect={handleLocationDetect}
              onUpdateFormData={setFormData}
              disabled={!isFormValid || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
