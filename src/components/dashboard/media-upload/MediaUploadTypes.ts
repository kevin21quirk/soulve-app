
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
  uploadProgress?: number;
  status: 'uploading' | 'ready' | 'error';
}

export interface MediaUploadProps {
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

export interface MediaUploadConfig {
  maxFiles: number;
  maxFileSize: number; // in MB
  acceptedTypes: Record<string, string[]>;
}

export const DEFAULT_MEDIA_CONFIG: MediaUploadConfig = {
  maxFiles: 5,
  maxFileSize: 10,
  acceptedTypes: {
    'image/*': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    'video/*': ['mp4', 'mov', 'avi', 'wmv']
  }
};
