
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Video, 
  Upload, 
  X, 
  Eye, 
  Download,
  RotateCcw,
  Crop,
  ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
  uploadProgress?: number;
  status: 'uploading' | 'ready' | 'error';
}

interface EnhancedMediaUploadProps {
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

const EnhancedMediaUpload = ({ 
  onMediaChange, 
  maxFiles = 5, 
  maxFileSize = 10,
  acceptedTypes = ['image/*', 'video/*']
}: EnhancedMediaUploadProps) => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === 'video/*') return file.type.startsWith('video/');
      return file.type === type;
    });
    
    if (!isValidType) {
      return 'File type not supported';
    }
    
    return null;
  };

  const processFiles = async (files: FileList) => {
    if (mediaFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    const newFiles: MediaFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      
      if (validation) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validation}`,
          variant: "destructive"
        });
        continue;
      }

      const mediaFile: MediaFile = {
        id: Date.now().toString() + i,
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        preview: URL.createObjectURL(file),
        size: file.size,
        uploadProgress: 0,
        status: 'uploading'
      };

      newFiles.push(mediaFile);
    }

    // Simulate upload progress
    newFiles.forEach((mediaFile, index) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setMediaFiles(prev => 
            prev.map(f => 
              f.id === mediaFile.id 
                ? { ...f, uploadProgress: Math.min((f.uploadProgress || 0) + 10, 100) }
                : f
            )
          );
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setMediaFiles(prev => 
            prev.map(f => 
              f.id === mediaFile.id 
                ? { ...f, status: 'ready', uploadProgress: 100 }
                : f
            )
          );
        }, 1000);
      }, index * 200);
    });

    const updatedFiles = [...mediaFiles, ...newFiles];
    setMediaFiles(updatedFiles);
    onMediaChange(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = mediaFiles.filter(f => f.id !== id);
    setMediaFiles(updatedFiles);
    onMediaChange(updatedFiles);
    
    // Clean up preview URL
    const fileToRemove = mediaFiles.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <Camera className="h-8 w-8 text-gray-400" />
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                Maximum {maxFiles} files, {maxFileSize}MB each
              </p>
            </div>

            <div className="flex justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaFiles.length >= maxFiles}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && processFiles(e.target.files)}
        className="hidden"
      />

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaFiles.map((mediaFile) => (
            <Card key={mediaFile.id} className="relative">
              <CardContent className="p-3">
                <div className="relative aspect-square mb-3">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <video
                      src={mediaFile.preview}
                      className="w-full h-full object-cover rounded"
                      controls={false}
                    />
                  )}
                  
                  {/* Status overlay */}
                  {mediaFile.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                      <div className="text-white text-center space-y-2">
                        <div className="text-xs">Uploading...</div>
                        <Progress value={mediaFile.uploadProgress} className="w-16" />
                      </div>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile(mediaFile.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {mediaFile.type === 'image' ? <ImageIcon className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                      {mediaFile.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(mediaFile.size)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 truncate">
                    {mediaFile.file.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedMediaUpload;
