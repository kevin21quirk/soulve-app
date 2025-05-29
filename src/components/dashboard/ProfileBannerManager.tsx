
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "./UserProfileTypes";

interface ProfileBannerManagerProps {
  setBannerFile: (file: MediaFile | null) => void;
  setEditData?: (updater: (prev: any) => any) => void;
}

export const useProfileBannerManager = ({ setBannerFile, setEditData }: ProfileBannerManagerProps) => {
  const { toast } = useToast();

  const uploadBannerToStorage = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(data.path);

      return publicUrl;
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
