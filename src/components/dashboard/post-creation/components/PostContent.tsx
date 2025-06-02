
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { PostFormData } from '../../CreatePostTypes';
import { User } from '@supabase/supabase-js';

interface PostContentProps {
  formData: PostFormData;
  user: User | null;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
}

export const PostContent = ({ formData, user, onUpdateFormData }: PostContentProps) => {
  return (
    <div className="p-4">
      <Input
        placeholder="Add a title (optional)"
        value={formData.title}
        onChange={(e) => onUpdateFormData(prev => ({ ...prev, title: e.target.value }))}
        className="mb-3 border-0 shadow-none text-sm placeholder-gray-400 focus-visible:ring-0"
      />

      <Textarea
        placeholder={`What's on your mind, ${user?.user_metadata?.first_name}?`}
        value={formData.description}
        onChange={(e) => onUpdateFormData(prev => ({ ...prev, description: e.target.value }))}
        className="border-0 shadow-none resize-none focus-visible:ring-0 text-base placeholder-gray-500 min-h-[80px]"
        rows={3}
      />

      {formData.location && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{formData.location}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateFormData(prev => ({ ...prev, location: '' }))}
            className="h-auto p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
