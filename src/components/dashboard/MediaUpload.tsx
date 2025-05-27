
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image, Video, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
}

interface MediaUploadProps {
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

const MediaUpload = ({ onMediaChange, maxFiles = 5, maxFileSize = 10 }: MediaUploadProps) => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.mov', '.avi']
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MediaFile[] = [];
    const maxSizeBytes = maxFileSize * 1024 * 1024;

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${maxFileSize}MB`,
          variant: "destructive"
        });
        return;
      }

      // Check file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image or video format`,
          variant: "destructive"
        });
        return;
      }

      // Check total files limit
      if (mediaFiles.length + newFiles.length >= maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${maxFiles} files`,
          variant: "destructive"
        });
        return;
      }

      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random(),
        file,
        type: isImage ? 'image' : 'video',
        preview: URL.createObjectURL(file),
        size: file.size
      };

      newFiles.push(mediaFile);
    });

    if (newFiles.length > 0) {
      const updatedFiles = [...mediaFiles, ...newFiles];
      setMediaFiles(updatedFiles);
      onMediaChange(updatedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(f => {
      if (f.id === fileId) {
        URL.revokeObjectURL(f.preview);
        return false;
      }
      return true;
    });
    setMediaFiles(updatedFiles);
    onMediaChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={mediaFiles.length >= maxFiles}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Add Media
        </Button>
        <span className="text-sm text-gray-500">
          {mediaFiles.length}/{maxFiles} files • Max {maxFileSize}MB each
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={Object.keys(acceptedTypes).join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mediaFiles.map((mediaFile) => (
            <Card key={mediaFile.id} className="relative p-2">
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
                onClick={() => removeFile(mediaFile.id)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Help Text */}
      {mediaFiles.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="flex justify-center mb-2">
            <Image className="h-6 w-6 text-gray-400 mr-2" />
            <Video className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Upload images or videos to enhance your post
          </p>
          <p className="text-xs text-gray-400">
            Supported: JPG, PNG, GIF, WebP, MP4, WebM, MOV
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
