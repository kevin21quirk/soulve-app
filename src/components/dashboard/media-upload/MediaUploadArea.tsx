
import { Image, Video } from "lucide-react";

const MediaUploadArea = () => {
  return (
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
  );
};

export default MediaUploadArea;
