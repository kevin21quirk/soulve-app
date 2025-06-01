
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaFile, MediaUploadConfig } from "./MediaUploadTypes";

export const useMediaUpload = (
  config: MediaUploadConfig,
  onMediaChange: (files: MediaFile[]) => void
) => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MediaFile[] = [];
    const maxSizeBytes = config.maxFileSize * 1024 * 1024;

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${config.maxFileSize}MB`,
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
      if (mediaFiles.length + newFiles.length >= config.maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${config.maxFiles} files`,
          variant: "destructive"
        });
        return;
      }

      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random(),
        file,
        type: isImage ? 'image' : 'video',
        preview: URL.createObjectURL(file),
        size: file.size,
        status: 'ready'
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

  return {
    mediaFiles,
    handleFileSelect,
    removeFile
  };
};
