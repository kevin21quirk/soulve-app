
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Image, Video } from "lucide-react";
import { MediaFile } from "./MediaUploadTypes";

interface MediaFileCardProps {
  mediaFile: MediaFile;
  onRemove: (fileId: string) => void;
}

const MediaFileCard = ({ mediaFile, onRemove }: MediaFileCardProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="relative p-2">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        {mediaFile.type === 'image' ? (
          <img
            src={mediaFile.preview}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-8 w-8 text-gray-400" />
            <video
              src={mediaFile.preview}
              className="w-full h-full object-cover absolute inset-0"
              muted
            />
          </div>
        )}
      </div>
      
      {/* File Info */}
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex items-center gap-1 mb-1">
          {mediaFile.type === 'image' ? (
            <Image className="h-3 w-3" />
          ) : (
            <Video className="h-3 w-3" />
          )}
          <span className="truncate">{mediaFile.file.name}</span>
        </div>
        <div className="text-gray-500">
          {formatFileSize(mediaFile.size)}
        </div>
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onRemove(mediaFile.id)}
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </Card>
  );
};

export default MediaFileCard;
