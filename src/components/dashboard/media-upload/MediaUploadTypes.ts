
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
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
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.mov', '.avi']
  }
};
