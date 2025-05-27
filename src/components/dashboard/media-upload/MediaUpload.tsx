
import { useRef } from "react";
import MediaUploadButton from "./MediaUploadButton";
import MediaFileCard from "./MediaFileCard";
import MediaUploadArea from "./MediaUploadArea";
import { useMediaUpload } from "./useMediaUpload";
import { MediaFile, DEFAULT_MEDIA_CONFIG, MediaUploadConfig } from "./MediaUploadTypes";

interface MediaUploadProps {
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

const MediaUpload = ({ 
  onMediaChange, 
  maxFiles = 5, 
  maxFileSize = 10 
}: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const config: MediaUploadConfig = {
    ...DEFAULT_MEDIA_CONFIG,
    maxFiles,
    maxFileSize
  };

  const { mediaFiles, handleFileSelect, removeFile } = useMediaUpload(
    config,
    onMediaChange
  );

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <MediaUploadButton
        onClick={() => fileInputRef.current?.click()}
        disabled={mediaFiles.length >= config.maxFiles}
        currentFileCount={mediaFiles.length}
        config={config}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={Object.keys(config.acceptedTypes).join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mediaFiles.map((mediaFile) => (
            <MediaFileCard
              key={mediaFile.id}
              mediaFile={mediaFile}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}

      {/* Help Text */}
      {mediaFiles.length === 0 && <MediaUploadArea />}
    </div>
  );
};

export default MediaUpload;
