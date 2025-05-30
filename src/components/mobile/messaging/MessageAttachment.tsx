
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause, FileText, Image as ImageIcon } from "lucide-react";
import { MessageAttachment as AttachmentType } from "@/types/messaging";

interface MessageAttachmentProps {
  attachment: AttachmentType;
}

const MessageAttachment = ({ attachment }: MessageAttachmentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    // Simulate download progress
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const renderAttachment = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="relative rounded-lg overflow-hidden max-w-xs">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="w-full h-auto max-h-64 object-cover"
              loading="lazy"
            />
            {attachment.size && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {formatFileSize(attachment.size)}
              </div>
            )}
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full h-10 w-10 p-0 bg-white shadow-sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate">{attachment.name}</p>
                <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-600 h-1 rounded-full transition-all duration-300" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">0:15 / 0:47</p>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="relative rounded-lg overflow-hidden max-w-xs bg-black">
            {attachment.thumbnail ? (
              <img 
                src={attachment.thumbnail} 
                alt={attachment.name}
                className="w-full h-auto max-h-64 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-800 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-12 w-12 p-0 bg-white bg-opacity-90 hover:bg-opacity-100"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {formatFileSize(attachment.size)}
            </div>
          </div>
        );
      
      case 'file':
      default:
        return (
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-xs">
            <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
              {downloadProgress > 0 && downloadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="p-2 flex-shrink-0"
              disabled={downloadProgress > 0 && downloadProgress < 100}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  return <div className="mt-2">{renderAttachment()}</div>;
};

export default MessageAttachment;
