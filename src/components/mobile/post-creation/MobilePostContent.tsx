
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { PostFormData } from '@/components/dashboard/CreatePostTypes';
import { User } from '@supabase/supabase-js';

interface MobilePostContentProps {
  formData: PostFormData;
  user: User | null;
  selectedImages: File[];
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
  onRemoveImage: (index: number) => void;
}

const MobilePostContent = ({ 
  formData, 
  user, 
  selectedImages, 
  onUpdateFormData, 
  onRemoveImage 
}: MobilePostContentProps) => {
  return (
    <div className="p-4">
      <textarea
        value={formData.description}
        onChange={(e) => onUpdateFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder={`What's on your mind, ${user?.user_metadata?.first_name}?`}
        className="w-full border-0 resize-none focus:ring-0 focus:outline-none text-sm min-h-[80px] placeholder-gray-400 bg-transparent"
        rows={3}
      />

      {formData.location && (
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{formData.location}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onUpdateFormData(prev => ({ ...prev, location: '' }))}
            className="p-0 h-auto ml-2 text-gray-400"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobilePostContent;
