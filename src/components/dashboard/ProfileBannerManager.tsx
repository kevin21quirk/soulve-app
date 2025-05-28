
import { useToast } from "@/hooks/use-toast";
import { MediaFile } from "./UserProfileTypes";

interface ProfileBannerManagerProps {
  setBannerFile: (file: MediaFile | null) => void;
}

export const useProfileBannerManager = ({ setBannerFile }: ProfileBannerManagerProps) => {
  const { toast } = useToast();

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      file,
      type: isImage ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      size: file.size
    };

    setBannerFile(mediaFile);
  };

  const handleRemoveBanner = (bannerFile: MediaFile | null, setEditData: (updater: (prev: any) => any) => void) => {
    if (bannerFile) {
      URL.revokeObjectURL(bannerFile.preview);
      setBannerFile(null);
    }
    setEditData((prev: any) => ({ ...prev, banner: '', bannerType: null }));
  };

  return {
    handleBannerUpload,
    handleRemoveBanner
  };
};
