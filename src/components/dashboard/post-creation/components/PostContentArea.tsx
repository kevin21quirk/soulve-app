
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PostFormData } from '../../CreatePostTypes';
import { URLPreviewService } from '@/services/urlPreviewService';
import { LinkPreview } from '../LinkPreview';
import { useDebounce } from '@/hooks/useDebounce';

interface PostContentAreaProps {
  formData: PostFormData;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
}

const PostContentArea = ({ formData, onUpdateFormData }: PostContentAreaProps) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const debouncedDescription = useDebounce(formData.description, 1000);

  // Auto-detect URLs and fetch preview
  useEffect(() => {
    const fetchURLPreview = async () => {
      if (!debouncedDescription || formData.linkPreview) return;

      const urls = URLPreviewService.detectURLs(debouncedDescription);
      if (urls.length === 0) return;

      setIsLoadingPreview(true);
      try {
        const preview = await URLPreviewService.fetchPreview(urls[0]);
        if (preview) {
          onUpdateFormData(prev => ({ ...prev, linkPreview: preview }));
        }
      } catch (error) {
        console.error('Error fetching URL preview:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchURLPreview();
  }, [debouncedDescription]);

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

      {isLoadingPreview && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Loading link preview...
        </div>
      )}

      {formData.linkPreview && (
        <LinkPreview
          preview={formData.linkPreview}
          onRemove={() => onUpdateFormData(prev => ({ ...prev, linkPreview: undefined }))}
        />
      )}
    </div>
  );
};

export default PostContentArea;
