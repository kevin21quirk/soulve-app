
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  MapPin, 
  Calendar,
  Send,
  X
} from 'lucide-react';
import { URGENCY_LEVELS } from '../post-options/PostOptionsConfig';
import { PostFormData } from '../CreatePostTypes';
import { useAuth } from '@/contexts/AuthContext';
import { PostHeader } from './components/PostHeader';
import { PostContent } from './components/PostContent';
import { PostActionBar } from './components/PostActionBar';
import { SelectedOptionsDisplay } from './components/SelectedOptionsDisplay';

interface SocialPostComposerProps {
  onSubmit: (data: PostFormData) => void;
  onCancel: () => void;
  isExpanded: boolean;
}

const SocialPostComposer = ({ onSubmit, onCancel, isExpanded }: SocialPostComposerProps) => {
  const { user } = useAuth();
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.category) return;
    
    const finalData = {
      ...formData,
      title: formData.title || formData.description.split('\n')[0].substring(0, 50) + '...'
    };
    
    onSubmit(finalData);
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setFormData(prev => ({ ...prev, location: 'Current Location' })),
        () => setFormData(prev => ({ ...prev, location: 'Location unavailable' }))
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <PostHeader
        user={user}
        showFeelings={showFeelings}
        showCategories={showCategories}
        formData={formData}
        onToggleFeelings={() => setShowFeelings(!showFeelings)}
        onToggleCategories={() => setShowCategories(!showCategories)}
        onUpdateFormData={setFormData}
        onCancel={onCancel}
      />

      <form onSubmit={handleSubmit}>
        <PostContent
          formData={formData}
          user={user}
          onUpdateFormData={setFormData}
        />

        <SelectedOptionsDisplay formData={formData} />

        <PostActionBar
          formData={formData}
          onLocationDetect={handleLocationDetect}
          onUpdateFormData={setFormData}
          disabled={!formData.description.trim() || !formData.category}
        />
      </form>
    </div>
  );
};

export default SocialPostComposer;
