
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/react";
import { MediaFile } from "./UserProfileTypes";

interface ProfileBannerManagerProps {
  setBannerFile: (file: MediaFile | null) => void;
  setEditData?: (updater: (prev: any) => any) => void;
}

export const useProfileBannerManager = ({ setBannerFile, setEditData }: ProfileBannerManagerProps) => {
  const { toast } = useToast();
  const { getToken } = useAuth();

  /**
   * Uploads a banner file to Vercel Blob via the server-side /api/upload endpoint.
   * The `_userId` parameter is kept for call-site compatibility but is unused —
   * the server derives identity from the Clerk bearer token.
   */
  const uploadBannerToStorage = async (file: File, _userId?: string): Promise<string | null> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'banners');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error ?? res.statusText);
      }

      const { url } = await res.json() as { url: string };
      return url;
    } catch (error) {
      console.error('Error uploading banner:', error);
      return null;
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: "Banner file must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive"
      });
      return;
    }

    // Create preview for immediate display
    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      file,
      type: isImage ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      size: file.size
    };

    setBannerFile(mediaFile);

    // Also update edit data immediately for preview
    if (setEditData) {
      setEditData((prev: any) => ({ 
        ...prev, 
        banner: mediaFile.preview,
        bannerType: mediaFile.type
      }));
    }
  };

  const handleRemoveBanner = (bannerFile: MediaFile | null, setEditDataFn?: (updater: (prev: any) => any) => void) => {
    if (bannerFile) {
      URL.revokeObjectURL(bannerFile.preview);
      setBannerFile(null);
    }
    if (setEditDataFn) {
      setEditDataFn((prev: any) => ({ ...prev, banner: '', bannerType: null }));
    }
  };

  return {
    handleBannerUpload,
    handleRemoveBanner,
    uploadBannerToStorage
  };
};
