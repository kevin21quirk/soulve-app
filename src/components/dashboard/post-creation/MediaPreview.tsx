
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Image, Video } from 'lucide-react';
import { MediaFile } from '../CreatePostTypes';

interface MediaPreviewProps {
  mediaFiles: MediaFile[];
  onRemoveFile: (id: string) => void;
}

const MediaPreview = ({ mediaFiles, onRemoveFile }: MediaPreviewProps) => {
  if (!mediaFiles || mediaFiles.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t border-gray-100 p-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mediaFiles.map((media) => (
          <div key={media.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
              {media.type === 'image' ? (
                <img
                  src={media.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveFile(media.id)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="mt-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                {media.type === 'image' ? (
                  <Image className="h-3 w-3" />
                ) : (
                  <Video className="h-3 w-3" />
                )}
                <span>{formatFileSize(media.size)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;
