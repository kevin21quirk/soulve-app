
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { MediaUploadConfig } from "./MediaUploadTypes";

interface MediaUploadButtonProps {
  onClick: () => void;
  disabled: boolean;
  currentFileCount: number;
  config: MediaUploadConfig;
}

const MediaUploadButton = ({ 
  onClick, 
  disabled, 
  currentFileCount, 
  config 
}: MediaUploadButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Add Media
      </Button>
      <span className="text-sm text-gray-500">
        {currentFileCount}/{config.maxFiles} files • Max {config.maxFileSize}MB each
      </span>
    </div>
  );
};

export default MediaUploadButton;
