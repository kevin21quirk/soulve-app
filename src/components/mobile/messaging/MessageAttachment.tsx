
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";

interface MessageAttachmentProps {
  attachment: any;
}

const MessageAttachment = ({ attachment }: MessageAttachmentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const renderAttachment = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="relative rounded-lg overflow-hidden max-w-xs">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="w-full h-auto"
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-1">
                <div className="bg-blue-600 h-1 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">0:15 / 0:47</p>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <div className="bg-blue-100 rounded-lg p-2">
              <Download className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-gray-600">{(attachment.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <div className="mt-2">{renderAttachment()}</div>;
};

export default MessageAttachment;
