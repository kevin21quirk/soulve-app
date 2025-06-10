
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PostFormData } from '../../CreatePostTypes';

interface PostContentAreaProps {
  formData: PostFormData;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
}

const PostContentArea = ({ formData, onUpdateFormData }: PostContentAreaProps) => {
  return (
    <div className="p-4 space-y-3">
      <Input
        placeholder="Add a title (optional)"
        value={formData.title}
        onChange={(e) => onUpdateFormData(prev => ({ ...prev, title: e.target.value }))}
        className="border-0 shadow-none text-sm placeholder-gray-400 focus-visible:ring-0"
      />

      <Textarea
        placeholder="What's happening in your community?"
        value={formData.description}
        onChange={(e) => onUpdateFormData(prev => ({ ...prev, description: e.target.value }))}
        className="border-0 shadow-none resize-none focus-visible:ring-0 text-base placeholder-gray-500 min-h-[80px]"
        rows={3}
      />
    </div>
  );
};

export default PostContentArea;
